import {
  Address,
  BaseAddress,
  RewardAddress,
} from "@emurgo/cardano-serialization-lib-nodejs";
import express, { Request, Response } from "express";
import * as _ from "lodash";
import url from "url";
import {
  Dto,
  GetDeliveredRewardsDto,
  GetQueueDto,
  ServerErrorDto,
} from "../client/src/entities/dto";
import { Tip, TransactionStatus } from "../client/src/entities/koios.entities";
import { VmTypes } from "../client/src/entities/vm";
import { PoolInfo } from "../client/src/entities/vm.entities";
import errorHandlerMiddleware, {
  errorHandlerWrapper,
  typedErrorHandlerWrapper,
} from "./middlewares/error-handler";
import AdminRouter from "./routes/admin";
import TxRouter from "./routes/tx";
import UtilRouter from "./routes/util";
import {
  CardanoNetwork,
  ITosiFeatures,
  getAccountsInfo,
  getDeliveredRewards,
  getEpochParams,
  getFromKoios,
  getFromVM,
  getPoolMetadata,
  getRewards,
  postFromKoios,
  sanitizeString,
  translateAdaHandle,
} from "./utils";
import { ICustomRewards } from "./utils/entities";
import { HttpStatusCode, createErrorWithCode } from "./utils/error";
import cors from "cors";
require("dotenv").config();
const fs = require("fs");

/** environment variables */
export const VM_KOIOS_URL =
  process.env.KOIOS_URL_TESTNET || process.env.KOIOS_URL;
export const CARDANO_NETWORK =
  process.env.CARDANO_NETWORK || CardanoNetwork.preview;
export const TOSIDROP_ADMIN_KEY =
  process.env.TOSIDROP_ADMIN_KEY || "admin key is not set";
const CLOUDFLARE_PSK = process.env.CLOUDFLARE_PSK;
const LOG_TYPE = process.env.LOG_TYPE || "dev";
const PORT = process.env.PORT || 3000;
const TOSIFEE = process.env.TOSIFEE || 500000;
const TOSIFEE_WHITELIST = process.env.TOSIFEE_WHITELIST;

const app = express();
app.use(express.json());
app.use(require("morgan")(LOG_TYPE));
app.use(cors({ origin: "*" }));

app.use("/api/tx", TxRouter);
app.use("/api/util", UtilRouter);
app.use("/api/admin", AdminRouter);

app.get(
  "/api/getsettings",
  typedErrorHandlerWrapper<Dto.GetVmSettings>(async (_, res) => {
    const settings = await getFromVM<VmTypes.Settings>("get_settings");
    return res.status(200).send(settings);
  }),
);

app.get(
  "/api/systeminfo",
  errorHandlerWrapper(async (_req: Request, res: Response) => {
    const systeminfo = await getFromVM("system_info");
    return res.status(200).send(systeminfo);
  }),
);

app.get(
  "/",
  errorHandlerWrapper((_req: Request, res: Response) => {
    res.status(200).json({
      status: "UP",
    });
  }),
);

app.get(
  "/health",
  errorHandlerWrapper((_req: Request, res: Response) => {
    res.status(200).json({
      status: "UP",
    });
  }),
);

app.get(
  "/healthz",
  errorHandlerWrapper(async (req: Request, res: Response) => {
    await getFromKoios<Tip[]>(`tip`);
    if (CLOUDFLARE_PSK) {
      if (req.headers["x-cloudflare-psk"]) {
        const myPsk = req.headers["x-cloudflare-psk"];
        if (myPsk == CLOUDFLARE_PSK) {
          const authResponse = await getFromVM("is_authenticated");
          return res.send(authResponse);
        } else {
          throw createErrorWithCode(HttpStatusCode.BAD_REQUEST, "PSK invalid");
        }
      } else {
        throw createErrorWithCode(HttpStatusCode.BAD_REQUEST, "PSK is missing");
      }
    } else {
      return res.status(200).json({
        status: "UP",
      });
    }
  }),
);

app.get(
  "/features",
  errorHandlerWrapper((_req: Request, res: Response) => {
    const features: ITosiFeatures = {
      tosi_fee: Number(TOSIFEE),
      tosi_fee_whitelist: TOSIFEE_WHITELIST,
      network: CARDANO_NETWORK,
    };

    return res.status(200).send(features);
  }),
);

app.get(
  "/api/getstakekey",
  errorHandlerWrapper(async (req: Request, res: Response) => {
    if (!VM_KOIOS_URL) {
      throw createErrorWithCode(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "KOIOS URL is not defined",
      );
    }

    const queryObject = url.parse(req.url, true).query;
    let address = queryObject.address as string;

    address = sanitizeString(address);

    let translatedAddress;

    if (!address) {
      throw createErrorWithCode(
        HttpStatusCode.BAD_REQUEST,
        "Address seems invalid",
      );
    }

    const prefix = address.slice(0, 5);

    switch (true) {
      /** for ADA Handle, translate the handle to a regular address */
      case prefix[0] === "$":
        translatedAddress = await translateAdaHandle(
          address,
          CARDANO_NETWORK,
          VM_KOIOS_URL,
        );
        address = translatedAddress;
        break;
      case prefix === "addr_":
        if (CARDANO_NETWORK === CardanoNetwork.mainnet) {
          throw createErrorWithCode(
            HttpStatusCode.BAD_REQUEST,
            "Inserted address is for a testnet",
          );
        }
        break;
      case prefix === "addr1":
        if (CARDANO_NETWORK === CardanoNetwork.preview) {
          throw createErrorWithCode(
            HttpStatusCode.BAD_REQUEST,
            "Inserted address is for a mainnet",
          );
        }
        break;
      case prefix === "stake":
        // We were given a stake address, pass it through
        return res.send({ staking_address: address });
      default:
        throw createErrorWithCode(
          HttpStatusCode.BAD_REQUEST,
          "Address seems invalid",
        );
    }

    let rewardAddressBytes = new Uint8Array(29);
    switch (CARDANO_NETWORK) {
      case CardanoNetwork.mainnet:
        rewardAddressBytes.set([0xe1], 0);
        break;
      case CardanoNetwork.preview:
      default:
        rewardAddressBytes.set([0xe0], 0);
        break;
    }

    const addressObject = Address.from_bech32(address);
    const baseAddress = BaseAddress.from_address(addressObject);
    if (baseAddress == null) return null;
    rewardAddressBytes.set(baseAddress.stake_cred().to_bytes().slice(4, 32), 1);

    let rewardAddress = RewardAddress.from_address(
      Address.from_bytes(rewardAddressBytes),
    );

    if (rewardAddress == null) return null;

    return res.send({
      staking_address: rewardAddress.to_address().to_bech32(),
    });
  }),
);

/**
 * @description get rewards available for user
 * @query
 * - address: user stake address
 */
app.get(
  "/api/getrewards",
  errorHandlerWrapper(async (req: Request, res: Response) => {
    const queryObject = url.parse(req.url, true).query;
    const stakeAddress = queryObject.address as string;
    if (!stakeAddress) {
      throw createErrorWithCode(
        HttpStatusCode.BAD_REQUEST,
        "Address is required",
      );
    }

    let claimableTokens = await getRewards(stakeAddress);
    const accountsInfo = await getAccountsInfo(stakeAddress);
    const poolInfo = await getPoolMetadata(accountsInfo[0]);

    if (poolInfo != null) {
      poolInfo.isWhitelisted = false;

      const whitelist = TOSIFEE_WHITELIST ? TOSIFEE_WHITELIST.split(",") : [];
      if (whitelist.includes(poolInfo.delegated_pool_id_bech32)) {
        poolInfo.isWhitelisted = true;
      }
    }

    const consolidatedGetRewards = {
      pool_info: poolInfo,
      claimable_tokens: claimableTokens,
    };

    return res.send(consolidatedGetRewards);
  }),
);

app.get(
  "/api/getcustomrewards",
  errorHandlerWrapper(async (req: Request, res: Response) => {
    const queryObject = url.parse(req.url, true).query;
    const { staking_address: stakeAddress, session_id, selected } = queryObject;
    let vmArgs = `custom_request&staking_address=${stakeAddress}&session_id=${session_id}&selected=${selected}&xwallet=true`;
    let isWhitelisted = false;

    if (!stakeAddress) {
      throw createErrorWithCode(
        HttpStatusCode.BAD_REQUEST,
        "Address is required",
      );
    }

    if (TOSIFEE_WHITELIST) {
      const whitelist = TOSIFEE_WHITELIST.split(",");
      const accountsInfo = await getAccountsInfo(`${stakeAddress}`);
      const accountInfo = accountsInfo[0];
      if (whitelist.includes(accountInfo.delegated_pool)) {
        vmArgs += "&unlocks_special=true";
        isWhitelisted = true;
      } else {
        vmArgs += `&overhead_fee=${TOSIFEE}&unlocks_special=true`;
      }
    } else {
      vmArgs += `&overhead_fee=${TOSIFEE}&unlocks_special=true`;
    }

    const submitCustomReward: any = await getFromVM(vmArgs);

    if (submitCustomReward == null) {
      throw new Error();
    }

    const customReward: ICustomRewards = {
      request_id: submitCustomReward.request_id,
      deposit: submitCustomReward.deposit,
      overhead_fee: submitCustomReward.overhead_fee,
      withdrawal_address: submitCustomReward.withdrawal_address,
      is_whitelisted: isWhitelisted,
    };

    return res.send(customReward);
  }),
);

app.get(
  "/api/getdeliveredrewards",
  errorHandlerWrapper(
    async (
      req: Request,
      res: Response<GetDeliveredRewardsDto | ServerErrorDto>,
    ) => {
      const queryObject = url.parse(req.url, true).query;
      const { staking_address: stakingAddress } = queryObject;
      if (!stakingAddress) {
        throw createErrorWithCode(
          HttpStatusCode.BAD_REQUEST,
          "Address is required",
        );
      }

      const deliveredRewards = await getDeliveredRewards(
        stakingAddress as string,
      );

      return res.status(200).send({
        deliveredRewards,
      });
    },
  ),
);

app.get(
  "/api/txstatus",
  errorHandlerWrapper(async (req: Request, res: Response) => {
    const queryObject = url.parse(req.url, true).query;
    const { request_id, session_id } = queryObject;

    if (!request_id) {
      throw createErrorWithCode(
        HttpStatusCode.BAD_REQUEST,
        "Request ID is required",
      );
    }

    if (!session_id) {
      throw createErrorWithCode(
        HttpStatusCode.BAD_REQUEST,
        "Session ID is required",
      );
    }

    const txStatus = await getFromVM(
      `check_status_custom_request&request_id=${request_id}&session_id=${session_id}`,
    );
    return res.send(txStatus);
  }),
);

app.get(
  "/api/gettransactionstatus",
  errorHandlerWrapper(async (req: Request, res: Response) => {
    const queryObject = url.parse(req.url, true).query;
    if (!queryObject.txHash) {
      throw createErrorWithCode(
        HttpStatusCode.BAD_REQUEST,
        "Tx hash is invalid",
      );
    }
    const getTransactionStatusResponse = await postFromKoios<
      TransactionStatus[]
    >(`tx_status`, { _tx_hashes: [queryObject.txHash] });
    return res.send(getTransactionStatusResponse);
  }),
);

app.get(
  "/api/getabsslot",
  errorHandlerWrapper(async (_req: Request, res: Response) => {
    const getTipResponse = await getFromKoios<Tip[]>(`tip`);
    return res.send({
      abs_slot:
        getTipResponse && getTipResponse.length
          ? getTipResponse[0].abs_slot
          : 0,
    });
  }),
);

app.get(
  "/api/getblock",
  errorHandlerWrapper(async (_req: Request, res: Response) => {
    const getTipResponse = await getFromKoios<Tip[]>(`tip`);
    return res.send({
      block_no:
        getTipResponse && getTipResponse.length
          ? getTipResponse[0].block_no
          : 0,
    });
  }),
);

app.get(
  "/api/gettip",
  errorHandlerWrapper(async (_req: Request, res: Response) => {
    const getTipResponse = await getFromKoios<Tip[]>(`tip`);
    res.send(getTipResponse[0]);
  }),
);

app.get(
  "/api/getepochparams",
  errorHandlerWrapper(async (_req: Request, res: Response) => {
    const getTipResponse = await getFromKoios<Tip[]>(`tip`);
    const getEpochParamsResponse = await getEpochParams(
      getTipResponse && getTipResponse.length ? getTipResponse[0].epoch_no : 0,
    );
    return res.send(getEpochParamsResponse);
  }),
);

app.get(
  "/api/getpopupinfo",
  errorHandlerWrapper(async (_req: Request, res: Response) => {
    const popupInfo = JSON.parse(
      fs.readFileSync(__dirname + "/public/json/popup.json", "utf8"),
    );
    return res.status(200).send(popupInfo);
  }),
);

app.get(
  "/api/getqueue",
  errorHandlerWrapper(async (_req: Request, res: Response<GetQueueDto>) => {
    const queue: GetQueueDto = await getFromVM("get_pending_tx_count");
    return res.status(200).send(queue);
  }),
);

const server = app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

process.on("SIGTERM", () => {
  server.close(() => {
    console.log("Server shutting down");
  });
});

app.use(errorHandlerMiddleware);

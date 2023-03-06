import {
  Address,
  BaseAddress,
  RewardAddress,
} from "@emurgo/cardano-serialization-lib-nodejs";
import express, { Request, Response } from "express";
import * as lodash from "lodash";
import url from "url";
import { CardanoTypes } from "../client/src/entities/cardano";
import { Dto } from "../client/src/entities/dto";
import { Tip } from "../client/src/entities/koios";
import { TosidropTypes } from "../client/src/entities/tosidrop";
import { PoolInfo, VmTypes } from "../client/src/entities/vm";
import { errorHandlerWrapper } from "./middlewares/error-handler";
import TxRouter from "./routes/tx";
import { createErrorWithCode, HttpStatusCode } from "./utils/error";
import {
  getAccountsInfo,
  getDeliveredRewards,
  getEpochParams,
  getFromKoios,
  getFromVM,
  getPoolMetadata,
  getPools,
  getPrices,
  getRewards,
  getTokens,
  translateAdaHandle,
} from "./utils/helpers";
const openapi = require("@reqlez/express-openapi");
const fs = require("fs");
require("dotenv").config();

/** environment variables */
export const VM_KOIOS_URL =
  process.env.KOIOS_URL_TESTNET || process.env.KOIOS_URL;
export const CARDANO_NETWORK =
  process.env.CARDANO_NETWORK || CardanoTypes.Network.preview;
const CLOUDFLARE_PSK = process.env.CLOUDFLARE_PSK;
const LOG_TYPE = process.env.LOG_TYPE || "dev";
const PORT = process.env.PORT || 3000;
const TOSIFEE = process.env.TOSIFEE || 500000;
const TOSIFEE_WHITELIST = process.env.TOSIFEE_WHITELIST;
const CLAIM_ENABLED = process.env.CLAIM_ENABLED === "true";
const ERGO_ENABLED = process.env.ERGO_ENABLED === "true";

const oapi = openapi({
  openapi: "3.0.0",
  info: {
    title: "TosiDrop",
    description: "Generated API docs for TosiDrop",
    version: "1",
  },
});

const app = express();
app.use(express.json());
app.use(require("morgan")(LOG_TYPE));
app.use(oapi);
app.use("/swaggerui", oapi.swaggerui);
app.use(express.static("../client/build"));

/** use routes folder */
app.use("/api/tx", TxRouter);

app.get(
  "/api/getprices",
  errorHandlerWrapper(
    async (
      _: Request<{}, {}, Dto.GetPrices["body"], Dto.GetPrices["query"]>,
      res: Response<Dto.GetPrices["response"]>
    ) => {
      const prices = await getPrices();
      return res.status(200).send(prices);
    }
  )
);

app.get(
  "/api/getpools",
  errorHandlerWrapper(
    async (
      _: Request<{}, {}, Dto.GetPools["body"], Dto.GetPools["query"]>,
      res: Response<Dto.GetPools["response"]>
    ) => {
      const pools = await getPools();
      const whitelist = TOSIFEE_WHITELIST ? TOSIFEE_WHITELIST.split(",") : [];
      const whitelistedPools: PoolInfo[] = [];
      const regularPools: PoolInfo[] = [];
      Object.values(pools).forEach((pool) => {
        if (pool.visible === "f" || pool.id.includes("project_")) {
          return;
        }
        if (whitelist.includes(pool.id)) {
          whitelistedPools.push(pool);
        } else {
          regularPools.push(pool);
        }
      });
      return res.status(200).send({
        whitelistedPools: lodash.shuffle(whitelistedPools),
        regularPools: lodash.shuffle(regularPools),
      });
    }
  )
);

app.get(
  "/api/gettokens",
  errorHandlerWrapper(
    async (
      _: Request<{}, {}, Dto.GetTokens["body"], Dto.GetTokens["query"]>,
      res: Response<Dto.GetTokens["response"]>
    ) => {
      const tokens = await getTokens();
      return res.status(200).send(tokens);
    }
  )
);

app.get(
  "/api/getsettings",
  errorHandlerWrapper(
    async (
      _: Request<{}, {}, Dto.GetSettings["body"], Dto.GetSettings["query"]>,
      res: Response<Dto.GetSettings["response"]>
    ) => {
      const settings: VmTypes.Settings = await getFromVM("get_settings");
      return res.status(200).send(settings);
    }
  )
);

app.get(
  "/api/systeminfo",
  errorHandlerWrapper(
    async (
      _: Request<{}, {}, Dto.GetSystemInfo["body"], Dto.GetSystemInfo["query"]>,
      res: Response<Dto.GetSystemInfo["response"]>
    ) => {
      const systeminfo = await getFromVM<Dto.GetSystemInfo["response"]>(
        "system_info"
      );
      return res.status(200).send(systeminfo);
    }
  )
);

app.get(
  "/health",
  errorHandlerWrapper(
    (
      _: Request<{}, {}, Dto.GetHealth["body"], Dto.GetHealth["query"]>,
      res: Response<Dto.GetHealth["response"]>
    ) => {
      res.status(200).json({
        status: "UP",
      });
    }
  )
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
  })
);

app.get(
  "/features",
  errorHandlerWrapper(
    (
      _: Request<{}, {}, Dto.GetFeatures["body"], Dto.GetFeatures["query"]>,
      res: Response<Dto.GetFeatures["response"]>
    ) => {
      const features: TosidropTypes.Features = {
        tosi_fee: Number(TOSIFEE),
        tosi_fee_whitelist: TOSIFEE_WHITELIST,
        claim_enabled: CLAIM_ENABLED,
        network: CARDANO_NETWORK,
        ergo_enabled: ERGO_ENABLED,
      };

      return res.status(200).send(features);
    }
  )
);

app.get(
  "/api/getstakekey",
  errorHandlerWrapper(
    async (
      req: Request<{}, {}, Dto.GetStakeKey["body"], Dto.GetStakeKey["query"]>,
      res: Response<Dto.GetStakeKey["response"]>
    ) => {
      if (!VM_KOIOS_URL) {
        throw createErrorWithCode(
          HttpStatusCode.INTERNAL_SERVER_ERROR,
          "KOIOS URL is not defined"
        );
      }

      let { address } = req.query;
      let translatedAddress;

      if (!address) {
        throw createErrorWithCode(
          HttpStatusCode.BAD_REQUEST,
          "Address seems invalid"
        );
      }

      const prefix = address.slice(0, 5);

      switch (true) {
        /** for ADA Handle, translate the handle to a regular address */
        case prefix[0] === "$":
          translatedAddress = await translateAdaHandle(
            address,
            CARDANO_NETWORK,
            VM_KOIOS_URL
          );
          address = translatedAddress;
          break;
        case prefix === "addr_":
          if (CARDANO_NETWORK === CardanoTypes.Network.mainnet) {
            throw createErrorWithCode(
              HttpStatusCode.BAD_REQUEST,
              "Inserted address is for a testnet"
            );
          }
          break;
        case prefix === "addr1":
          if (CARDANO_NETWORK === CardanoTypes.Network.preview) {
            throw createErrorWithCode(
              HttpStatusCode.BAD_REQUEST,
              "Inserted address is for a mainnet"
            );
          }
          break;
        case prefix === "stake":
          // We were given a stake address, pass it through
          return res.send({ staking_address: address });
        default:
          throw createErrorWithCode(
            HttpStatusCode.BAD_REQUEST,
            "Address seems invalid"
          );
      }

      let rewardAddressBytes = new Uint8Array(29);
      switch (CARDANO_NETWORK) {
        case CardanoTypes.Network.mainnet:
          rewardAddressBytes.set([0xe1], 0);
          break;
        case CardanoTypes.Network.preview:
        default:
          rewardAddressBytes.set([0xe0], 0);
          break;
      }

      const addressObject = Address.from_bech32(address);
      const baseAddress = BaseAddress.from_address(addressObject);
      if (baseAddress == null) return null;
      rewardAddressBytes.set(
        baseAddress.stake_cred().to_bytes().slice(4, 32),
        1
      );

      let rewardAddress = RewardAddress.from_address(
        Address.from_bytes(rewardAddressBytes)
      );

      if (rewardAddress == null) return null;

      return res.send({
        staking_address: rewardAddress.to_address().to_bech32(),
      });
    }
  )
);

app.get(
  "/api/getrewards",
  errorHandlerWrapper(
    async (
      req: Request<{}, {}, Dto.GetRewards["body"], Dto.GetRewards["query"]>,
      res: Response<Dto.GetRewards["response"]>
    ) => {
      const { address: stakeAddress } = req.query;

      if (!stakeAddress) {
        throw createErrorWithCode(
          HttpStatusCode.BAD_REQUEST,
          "Address is required"
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
    }
  )
);

app.get(
  "/api/getcustomrewards",
  errorHandlerWrapper(
    async (
      req: Request<{}, {}, {}, Dto.GetCustomRewards["query"]>,
      res: Response<Dto.GetCustomRewards["response"]>
    ) => {
      const queryObject = url.parse(req.url, true).query;
      const {
        staking_address: stakeAddress,
        session_id,
        selected,
        unlock,
      } = queryObject;
      let vmArgs = `custom_request&staking_address=${stakeAddress}&session_id=${session_id}&selected=${selected}&xwallet=true`;
      let isWhitelisted = false;

      if (!stakeAddress) {
        throw createErrorWithCode(
          HttpStatusCode.BAD_REQUEST,
          "Address is required"
        );
      }

      if (unlock === "true") {
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
      } else {
        vmArgs += "&unlocks_special=false";
      }

      const submitCustomReward: any = await getFromVM(vmArgs);

      if (submitCustomReward == null) {
        throw new Error();
      }

      const customReward: VmTypes.CustomRewards = {
        request_id: submitCustomReward.request_id,
        deposit: submitCustomReward.deposit,
        overhead_fee: submitCustomReward.overhead_fee,
        withdrawal_address: submitCustomReward.withdrawal_address,
        is_whitelisted: isWhitelisted,
      };

      return res.send(customReward);
    }
  )
);

app.get(
  "/api/getdeliveredrewards",
  errorHandlerWrapper(
    async (
      req: Request<{}, {}, {}, Dto.GetDeliveredRewards["query"]>,
      res: Response<Dto.GetDeliveredRewards["response"]>
    ) => {
      const { staking_address: stakingAddress } = req.query;
      if (!stakingAddress) {
        throw createErrorWithCode(
          HttpStatusCode.BAD_REQUEST,
          "Address is required"
        );
      }

      const deliveredRewards = await getDeliveredRewards(
        stakingAddress as string
      );

      return res.status(200).send({
        deliveredRewards,
      });
    }
  )
);

app.get(
  "/api/txstatus",
  errorHandlerWrapper(
    async (
      req: Request<{}, {}, {}, Dto.GetTxStatus["query"]>,
      res: Response<Dto.GetTxStatus["response"]>
    ) => {
      const { request_id, session_id } = req.query;

      if (!request_id) {
        throw createErrorWithCode(
          HttpStatusCode.BAD_REQUEST,
          "Request ID is required"
        );
      }

      if (!session_id) {
        throw createErrorWithCode(
          HttpStatusCode.BAD_REQUEST,
          "Session ID is required"
        );
      }

      const txStatus = await getFromVM<Dto.GetTxStatus["response"]>(
        `check_status_custom_request&request_id=${request_id}&session_id=${session_id}`
      );
      return res.send(txStatus);
    }
  )
);

app.get(
  "/api/gettip",
  errorHandlerWrapper(
    async (_: Request, res: Response<Dto.GetTip["response"]>) => {
      const getTipResponse = await getFromKoios<Tip[]>(`tip`);
      res.send(getTipResponse[0]);
    }
  )
);

app.get(
  "/api/getepochparams",
  errorHandlerWrapper(
    async (_: Request, res: Response<Dto.GetEpochParams["response"]>) => {
      const getTipResponse = await getFromKoios<Tip[]>(`tip`);
      const getEpochParamsResponse = await getEpochParams(
        getTipResponse && getTipResponse.length ? getTipResponse[0].epoch_no : 0
      );
      return res.send(getEpochParamsResponse);
    }
  )
);

app.get(
  "/api/getprojects",
  errorHandlerWrapper(
    async (_: Request, res: Response<Dto.GetProjects["response"]>) => {
      const projects = JSON.parse(
        fs.readFileSync(__dirname + "/public/json/projects.json", "utf8")
      );
      return res.status(200).send(projects);
    }
  )
);

app.get(
  "/api/getpopupinfo",
  errorHandlerWrapper(
    async (_: Request, res: Response<Dto.GetPopUpInfo["response"]>) => {
      const popupInfo = JSON.parse(
        fs.readFileSync(__dirname + "/public/json/popup.json", "utf8")
      );
      return res.status(200).send(popupInfo);
    }
  )
);

app.get(
  "/api/getqueue",
  errorHandlerWrapper(
    async (_: Request, res: Response<Dto.GetQueue["response"]>) => {
      const queue = await getFromVM<Dto.GetQueue["response"]>(
        "get_pending_tx_count"
      );
      return res.status(200).send(queue);
    }
  )
);

// host static files such as images
app.use("/api/img", express.static(__dirname + "/public/img"));

// Fallback to React app
app.get(
  "*",
  errorHandlerWrapper((_: Request, res: Response) => {
    return res.sendFile("client/build/index.html", { root: "../" });
  })
);

const server = app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

process.on("SIGTERM", () => {
  server.close(() => {
    console.log("Server shutting down");
  });
});

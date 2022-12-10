import {
  Address,
  BaseAddress,
  RewardAddress,
} from "@emurgo/cardano-serialization-lib-nodejs";
import express, { Request, Response } from "express";
import url from "url";
import { GetQueueDto } from "../client/src/entities/dto";
import { Tip, TransactionStatus } from "../client/src/entities/koios.entities";
import {
  CardanoNetwork,
  getAccountsInfo,
  getEpochParams,
  getFromKoios,
  getFromVM,
  getPoolMetadata,
  getPools,
  getPrices,
  getRewards,
  getTokens,
  ITosiFeatures,
  IVMSettings,
  postFromKoios,
  translateAdaHandle,
} from "./utils";
import { ICustomRewards } from "./utils/entities";

require("dotenv").config();
const openapi = require("@wesleytodd/openapi");
const fs = require("fs");
const AIRDROP_ENABLED = process.env.AIRDROP_ENABLED || true;
const CARDANO_NETWORK = process.env.CARDANO_NETWORK || CardanoNetwork.preview;
const CLAIM_ENABLED = process.env.CLAIM_ENABLED || true;
const CLOUDFLARE_PSK = process.env.CLOUDFLARE_PSK;
const LOG_TYPE = process.env.LOG_TYPE || "dev";
const PORT = process.env.PORT || 3000;
const TOSIFEE = process.env.TOSIFEE || 500000;
const TOSIFEE_WHITELIST = process.env.TOSIFEE_WHITELIST;
const VM_KOIOS_URL = process.env.KOIOS_URL_TESTNET || process.env.KOIOS_URL;

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

/**
 * Serve static files for our React app
 */
app.use(express.static("../client/build"));

const server = app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

process.on("SIGTERM", () => {
  server.close(() => {
    console.log("Server shutting down");
  });
});

const resp200Ok = {
  responses: {
    200: {
      description: "Success",
      content: {
        "application/json": {
          schema: {
            type: "object",
          },
        },
      },
    },
  },
};

const resp200Ok500Bad = {
  responses: {
    200: {
      description: "Success",
      content: {
        "application/json": {
          schema: {
            type: "object",
          },
        },
      },
    },
    500: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              error: { type: "string" },
            },
          },
        },
      },
    },
  },
};

app.get("/api/getprices", oapi.path(resp200Ok), async (req, res) => {
  const prices = await getPrices();
  return res.status(200).send(prices);
});

app.get("/api/getpools", oapi.path(resp200Ok), async (req, res) => {
  const pools = await getPools();
  return res.status(200).send(pools);
});

app.get("/api/gettokens", oapi.path(resp200Ok), async (req, res) => {
  const tokens = await getTokens();
  return res.status(200).send(tokens);
});

app.get("/api/getsettings", oapi.path(resp200Ok), async (req, res) => {
  const settings: IVMSettings = await getFromVM("get_settings");
  return res.status(200).send(settings);
});

app.get("/api/systeminfo", oapi.path(resp200Ok), async (req, res) => {
  const systeminfo = await getFromVM("system_info");
  return res.status(200).send(systeminfo);
});

app.get("/health", (req: any, res: any) => {
  res.status(200).json({
    status: "UP",
  });
});

app.get("/healthz", async (req: any, res: any) => {
  try {
    const getTipResponse = await getFromKoios<Tip[]>(`tip`);
  } catch (error: any) {
    return res.status(502).send({ error: "Failed to get tip from Koios" });
  }
  if (CLOUDFLARE_PSK) {
    if (req.headers["x-cloudflare-psk"]) {
      const myPsk = req.headers["x-cloudflare-psk"];
      if (myPsk == CLOUDFLARE_PSK) {
        const authResponse = await getFromVM("is_authenticated");
        res.send(authResponse);
      } else {
        res.status(403).json({
          error: "PSK invalid",
        });
      }
    } else {
      res.status(401).json({
        error: "PSK missing",
      });
    }
  } else {
    res.status(200).json({
      status: "UP",
    });
  }
});

app.get("/features", (req: any, res: any) => {
  const features: ITosiFeatures = {
    tosi_fee: Number(TOSIFEE),
    tosi_fee_whitelist: TOSIFEE_WHITELIST,
    airdrop_enabled:
      typeof AIRDROP_ENABLED == "string"
        ? JSON.parse(AIRDROP_ENABLED.toLowerCase())
        : AIRDROP_ENABLED,
    claim_enabled:
      typeof CLAIM_ENABLED == "string"
        ? JSON.parse(CLAIM_ENABLED.toLowerCase())
        : CLAIM_ENABLED,
    network: CARDANO_NETWORK,
  };

  return res.status(200).send(features);
});

app.get(
  "/api/getstakekey",
  oapi.path({
    description:
      "Return a stake address from a given address string. Resolves adahandles.",
    parameters: [
      {
        name: "address",
        in: "query",
        required: true,
      },
    ],
    responses: {
      200: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                staking_address: { type: "string" },
              },
            },
          },
        },
      },
      400: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                error: { type: "string" },
              },
            },
          },
        },
      },
      500: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                error: { type: "string" },
              },
            },
          },
        },
      },
    },
  }),
  async (req: any, res: any) => {
    try {
      const queryObject = url.parse(req.url, true).query;
      let address = queryObject.address as string;
      let translatedAddress;

      if (!address)
        return res.status(400).send({ error: "Address seems invalid" });
      if (!VM_KOIOS_URL)
        return res.status(500).send({ error: "KOIOS URL is not defined" });

      const prefix = address.slice(0, 5);

      switch (true) {
        /**
         * for ADA Handle, translate the handle
         * to a functional address
         */
        case prefix[0] === "$":
          translatedAddress = await translateAdaHandle(
            address,
            CARDANO_NETWORK,
            VM_KOIOS_URL
          );
          address = translatedAddress;
          break;
        case prefix === "addr_":
          if (CARDANO_NETWORK === CardanoNetwork.mainnet)
            return res
              .status(400)
              .send({ error: "Inserted address is for a testnet" });
          break;
        case prefix === "addr1":
          if (CARDANO_NETWORK === CardanoNetwork.preview)
            return res
              .status(400)
              .send({ error: "Inserted address is for mainnet" });
          break;
        case prefix === "stake":
          // We were given a stake address, pass it through
          return res.send({ staking_address: address });
          break;
        default:
          return res.status(400).send({ error: "Address seems invalid" });
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
    } catch (error: any) {
      return res.status(500).send({
        error:
          "Fails to get the stake key. Are you sure the inserted address is correct?",
      });
    }
  }
);

/**
 * @description get rewards available for user
 * @query
 * - address: user stake address
 */
app.get(
  "/api/getrewards",
  oapi.path({
    description: "Return available rewards from a given stake address.",
    parameters: [
      {
        name: "address",
        in: "query",
        required: true,
      },
    ],
    responses: {
      200: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                pool_info: { type: "object" },
                claimable_tokens: { type: "object" },
              },
            },
          },
        },
      },
      400: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                error: { type: "string" },
              },
            },
          },
        },
      },
      500: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                error: { type: "string" },
              },
            },
          },
        },
      },
    },
  }),
  async (req: any, res: any) => {
    try {
      const queryObject = url.parse(req.url, true).query;
      const stakeAddress = queryObject.address as string;
      if (!stakeAddress)
        return res
          .status(400)
          .send({ error: "No address provided to /api/getrewards" });

      let claimableTokens = await getRewards(stakeAddress);
      const accountsInfo = await getAccountsInfo(stakeAddress);
      const poolInfo = await getPoolMetadata(accountsInfo[0]);

      const consolidatedGetRewards = {
        pool_info: poolInfo,
        claimable_tokens: claimableTokens,
      };

      return res.send(consolidatedGetRewards);
    } catch (error: any) {
      return res
        .status(500)
        .send({ error: "An error occurred in /api/getrewards" });
    }
  }
);

app.get(
  "/api/getcustomrewards",
  oapi.path({
    description: "Return available rewards from a given stake address.",
    parameters: [
      {
        name: "staking_address",
        in: "query",
        required: true,
      },
      {
        name: "session_id",
        in: "query",
        required: true,
      },
      {
        name: "selected",
        in: "query",
        required: true,
      },
      {
        name: "unlock",
        in: "query",
        required: false,
      },
    ],
    responses: {
      200: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                request_id: { type: "string" },
                deposit: { type: "number" },
                overhead_fee: { type: "number" },
                withdrawal_address: { type: "string" },
                is_whitelisted: { type: "boolean" },
              },
            },
          },
        },
      },
      400: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                error: { type: "string" },
              },
            },
          },
        },
      },
      500: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                error: { type: "string" },
              },
            },
          },
        },
      },
    },
  }),
  async (req: any, res: any) => {
    try {
      const queryObject = url.parse(req.url, true).query;
      const { staking_address, session_id, selected, unlock } = queryObject;
      let vmArgs = `custom_request&staking_address=${staking_address}&session_id=${session_id}&selected=${selected}&xwallet=true`;
      let isWhitelisted = false;

      if (!staking_address)
        return res.status(400).send({ error: "staking_address required" });
      if (unlock === "true") {
        if (TOSIFEE_WHITELIST) {
          const whitelist = TOSIFEE_WHITELIST.split(",");
          const accountsInfo = await getAccountsInfo(`${staking_address}`);
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

      const customReward: ICustomRewards = {
        request_id: submitCustomReward.request_id,
        deposit: submitCustomReward.deposit,
        overhead_fee: submitCustomReward.overhead_fee,
        withdrawal_address: submitCustomReward.withdrawal_address,
        is_whitelisted: isWhitelisted,
      };

      return res.send(customReward);
    } catch (e: any) {
      return res
        .status(500)
        .send({ error: "An error occurred in /api/getcustomrewards" });
    }
  }
);

app.get(
  "/api/getdeliveredrewards",
  oapi.path({
    description: "Return delivered rewards from a given stake address.",
    parameters: [
      {
        name: "staking_address",
        in: "query",
        required: true,
      },
    ],
    responses: {
      200: {
        content: {
          "application/json": {
            schema: {
              type: "object",
            },
          },
        },
      },
      400: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                error: { type: "string" },
              },
            },
          },
        },
      },
      500: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                error: { type: "string" },
              },
            },
          },
        },
      },
    },
  }),
  async (req: any, res: any) => {
    try {
      const queryObject = url.parse(req.url, true).query;
      const { staking_address } = queryObject;
      let vmArgs = `delivered_rewards&staking_address=${staking_address}`;
      if (!staking_address)
        return res
          .status(400)
          .send({ error: "No address provided to /api/getdeliveredrewards" });

      const deliveredRewards: any = await getFromVM(vmArgs);
      if (deliveredRewards == null) {
        throw new Error();
      }
      return res.send(deliveredRewards);
    } catch (e: any) {
      return res
        .status(500)
        .send({ error: "An error occurred in /api/getcustomrewards" });
    }
  }
);

app.get(
  "/api/txstatus",
  oapi.path({
    description:
      "Return status of a transaction from request_id and session_id",
    parameters: [
      {
        name: "request_id",
        in: "query",
        required: true,
      },
      {
        name: "session_id",
        in: "query",
        required: true,
      },
    ],
    responses: {
      200: {
        content: {
          "application/json": {
            schema: {
              type: "object",
            },
          },
        },
      },
      400: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                error: { type: "string" },
              },
            },
          },
        },
      },
      500: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                error: { type: "string" },
              },
            },
          },
        },
      },
    },
  }),
  async (req, res) => {
    try {
      const queryObject = url.parse(req.url, true).query;
      const { request_id, session_id } = queryObject;

      if (!request_id || !session_id)
        return res
          .status(400)
          .send({ error: "Missing request or session ID in /api/txstatus" });

      const txStatus = await getFromVM(
        `check_status_custom_request&request_id=${request_id}&session_id=${session_id}`
      );
      return res.send(txStatus);
    } catch (e: any) {
      return res
        .status(500)
        .send({ error: "An error occurred in /api/txstatus" });
    }
  }
);

app.get(
  "/api/gettransactionstatus",
  oapi.path({
    description: "Return status of a transaction from txHash",
    parameters: [
      {
        name: "txHash",
        in: "query",
        required: true,
      },
    ],
    responses: {
      200: {
        content: {
          "application/json": {
            schema: {
              type: "object",
            },
          },
        },
      },
      400: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                error: { type: "string" },
              },
            },
          },
        },
      },
      500: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                error: { type: "string" },
              },
            },
          },
        },
      },
    },
  }),
  async (req: any, res: any) => {
    try {
      const queryObject = url.parse(req.url, true).query;
      if (queryObject.txHash) {
        const getTransactionStatusResponse = await postFromKoios<
          TransactionStatus[]
        >(`tx_status`, { _tx_hashes: [queryObject.txHash] });
        res.send(getTransactionStatusResponse);
      } else {
        res.status(400).send({ error: "Tx hash seems invalid" });
      }
    } catch (error: any) {
      return res
        .status(500)
        .send({ error: "An error occurred in /api/gettransactionstatus" });
    }
  }
);

app.get(
  "/api/getabsslot",
  oapi.path(resp200Ok500Bad),
  async (req: any, res: any) => {
    try {
      const getTipResponse = await getFromKoios<Tip[]>(`tip`);
      res.send({
        abs_slot:
          getTipResponse && getTipResponse.length
            ? getTipResponse[0].abs_slot
            : 0,
      });
    } catch (error: any) {
      return res
        .status(500)
        .send({ error: "An error occurred in /api/getabsslot" });
    }
  }
);

app.get(
  "/api/getblock",
  oapi.path(resp200Ok500Bad),
  async (req: any, res: any) => {
    try {
      const getTipResponse = await getFromKoios<Tip[]>(`tip`);
      res.send({
        block_no:
          getTipResponse && getTipResponse.length
            ? getTipResponse[0].block_no
            : 0,
      });
    } catch (error: any) {
      return res
        .status(500)
        .send({ error: "An error occurred in /api/getblock" });
    }
  }
);

app.get(
  "/api/gettip",
  oapi.path(resp200Ok500Bad),
  async (req: any, res: any) => {
    try {
      const getTipResponse = await getFromKoios<Tip[]>(`tip`);
      res.send(getTipResponse[0]);
    } catch (error: any) {
      return res
        .status(500)
        .send({ error: "An error occurred in /api/gettip" });
    }
  }
);

app.get(
  "/api/getepochparams",
  oapi.path(resp200Ok500Bad),
  async (req: any, res: any) => {
    try {
      const getTipResponse = await getFromKoios<Tip[]>(`tip`);
      const getEpochParamsResponse = await getEpochParams(
        getTipResponse && getTipResponse.length ? getTipResponse[0].epoch_no : 0
      );
      res.send(getEpochParamsResponse);
    } catch (error: any) {
      return res
        .status(500)
        .send({ error: "An error occurred in /api/getepochparams" });
    }
  }
);

app.get(
  "/api/getprojects",
  oapi.path(resp200Ok),
  async (req: any, res: any) => {
    const projects = JSON.parse(
      fs.readFileSync(__dirname + "/public/json/projects.json", "utf8")
    );
    return res.status(200).send(projects);
  }
);

app.get(
  "/api/getpopupinfo",
  oapi.path(resp200Ok),
  async (req: any, res: any) => {
    const popupInfo = JSON.parse(
      fs.readFileSync(__dirname + "/public/json/popup.json", "utf8")
    );
    return res.status(200).send(popupInfo);
  }
);

app.get("/api/getqueue", async (req: Request, res: Response<GetQueueDto>) => {
  const queue: GetQueueDto = await getFromVM("get_pending_tx_count");
  return res.status(200).send(queue);
});

// host static files such as images
app.use("/api/img", express.static(__dirname + "/public/img"));

// Fallback to React app
app.get("*", (req, res) => {
  res.sendFile("client/build/index.html", { root: "../" });
});

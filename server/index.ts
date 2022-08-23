import express from "express";
import url from "url";
import cors from "cors";
import {
  Address,
  BaseAddress,
  RewardAddress,
} from "@emurgo/cardano-serialization-lib-nodejs";
import { Tip, TransactionStatus } from "../client/src/entities/koios.entities";
import {
  CardanoNetwork,
  translateAdaHandle,
  getFromVM,
  getPoolMetadata,
  getPools,
  getTokens,
  getFromKoios,
  getAccountsInfo,
  postFromKoios,
  getEpochParams,
  getRewards,
  IVMSettings,
  ITosiFeatures,
} from "./utils";
require("dotenv").config();

const AIRDROP_ENABLED = process.env.AIRDROP_ENABLED || true;
const CARDANO_NETWORK = process.env.CARDANO_NETWORK || CardanoNetwork.testnet;
const CLAIM_ENABLED = process.env.CLAIM_ENABLED || true;
const CLOUDFLARE_PSK = process.env.CLOUDFLARE_PSK;
const LOG_TYPE = process.env.LOG_TYPE || "dev";
const PORT = process.env.PORT || 3000;
const TOSIFEE = process.env.TOSIFEE || 500000;
const TOSIFEE_WHITELIST = process.env.TOSIFEE_WHITELIST;
const VM_KOIOS_URL = process.env.KOIOS_URL_TESTNET || process.env.KOIOS_URL;

const app = express();
app.use(cors());
app.use(express.json());
app.use(require("morgan")(LOG_TYPE));

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

app.get("/getpools", async (req, res) => {
  const pools = await getPools();
  return res.status(200).send(pools);
});

app.get("/gettokens", async (req, res) => {
  const tokens = await getTokens();
  return res.status(200).send(tokens);
});

app.get("/getsettings", async (req, res) => {
  const settings: IVMSettings = await getFromVM("get_settings");
  return res.status(200).send(settings);
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

app.get("/getstakekey", async (req: any, res: any) => {
  try {
    const queryObject = url.parse(req.url, true).query;
    let address = queryObject.address as string;
    let translatedAddress;

    if (!address) return res.send({ error: "Address seems invalid" });
    if (!VM_KOIOS_URL) return res.send({ error: "KOIOS URL is not defined" });

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
          return res.send({ error: "Inserted address is for testnet" });
        break;
      case prefix === "addr1":
        if (CARDANO_NETWORK === CardanoNetwork.testnet)
          return res.send({ error: "Inserted address is for mainnet" });
        break;
      case prefix === "stake":
        // We were given a stake address, pass it through
        return res.send({ staking_address: address });
        break;
      default:
        return res.send({ error: "Address seems invalid" });
    }

    let rewardAddressBytes = new Uint8Array(29);
    switch (CARDANO_NETWORK) {
      case CardanoNetwork.mainnet:
        rewardAddressBytes.set([0xe1], 0);
        break;
      case CardanoNetwork.testnet:
      default:
        rewardAddressBytes.set([0xe0], 0);
        break;
    }

    const addressObject = Address.from_bech32(address);
    const baseAddress = BaseAddress.from_address(addressObject);
    if (baseAddress == null) return null;
    rewardAddressBytes.set(baseAddress.stake_cred().to_bytes().slice(4, 32), 1);

    let rewardAddress = RewardAddress.from_address(
      Address.from_bytes(rewardAddressBytes)
    );

    if (rewardAddress == null) return null;

    return res.send({
      staking_address: rewardAddress.to_address().to_bech32(),
    });
  } catch (error: any) {
    return res
      .status(500)
      .send({ error: "An error occurred in /getstakekey" });
  }
});

/**
 * @description get rewards available for user
 * @query
 * - address: user stake address
 */
app.get("/getrewards", async (req: any, res: any) => {
  try {
    const queryObject = url.parse(req.url, true).query;
    const stakeAddress = queryObject.address as string;
    if (!stakeAddress) return res.status(418).send({ error: "No address provided to /getrewards" });

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
      .send({ error: "An error occurred in /getrewards" });
  }
});

app.get("/getcustomrewards", async (req: any, res: any) => {
  try {
    const queryObject = url.parse(req.url, true).query;
    const { staking_address, session_id, selected, unlock } = queryObject;
    let vmArgs = `custom_request&staking_address=${staking_address}&session_id=${session_id}&selected=${selected}`;

    if (!staking_address) return res.sendStatus(400);
    if (unlock === "true") {
      if (TOSIFEE_WHITELIST) {
        const whitelist = TOSIFEE_WHITELIST.split(",");
        const accountsInfo = await getAccountsInfo(`${staking_address}`);
        const accountInfo = accountsInfo[0];
        if (whitelist.includes(accountInfo.delegated_pool)) {
          vmArgs += "&unlocks_special=true";
	} else {
          vmArgs += `&overhead_fee=${TOSIFEE}&unlocks_special=true`;
	}
      } else {
        vmArgs += `&overhead_fee=${TOSIFEE}&unlocks_special=true`;
      }
    } else {
      vmArgs += "&unlocks_special=false";
    }

    const submitCustomReward = await getFromVM(vmArgs);
    return res.send(submitCustomReward);
  } catch (e: any) {
    return res
      .status(500)
      .send({ error: "An error occurred in /getcustomrewards" });
  }
});

app.get("/txstatus", async (req, res) => {
  try {
    const queryObject = url.parse(req.url, true).query;
    const { request_id, session_id } = queryObject;

    if (!request_id || !session_id) return res.status(400).send({ "Missing request or session ID in /txstatus" });

    const txStatus = await getFromVM(
      `check_status_custom_request&request_id=${request_id}&session_id=${session_id}`
    );
    return res.send(txStatus);
  } catch (e: any) {
    return res
    .status(500)
    .send({ error: "An error occurred in /txstatus" });
  }
});

app.get("/gettransactionstatus", async (req: any, res: any) => {
  try {
    const queryObject = url.parse(req.url, true).query;
    if (queryObject.txHash) {
      const getTransactionStatusResponse = await postFromKoios<
        TransactionStatus[]
      >(`tx_status`, { _tx_hashes: [queryObject.txHash] });
      res.send(getTransactionStatusResponse);
    } else {
      res.send({ error: "Tx hash seems invalid" });
    }
  } catch (error: any) {
    return res
    .status(500)
    .send({ error: "An error occurred in /gettransactionstatus" });
  }
});

app.get("/getabsslot", async (req: any, res: any) => {
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
    .send({ error: "An error occurred in /getabsslot" });
  }
});

app.get("/getblock", async (req: any, res: any) => {
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
      .send({ error: "An error occurred in /getblock" });
  }
});

app.get("/gettip", async (req: any, res: any) => {
  try {
    const getTipResponse = await getFromKoios<Tip[]>(`tip`);
    res.send(getTipResponse[0]);
  } catch (error: any) {
    return res
      .status(500)
      .send({ error: "An error occurred in /gettip" });
  }
});

app.get("/getepochparams", async (req: any, res: any) => {
  try {
    const getTipResponse = await getFromKoios<Tip[]>(`tip`);
    const getEpochParamsResponse = await getEpochParams(
      getTipResponse && getTipResponse.length ? getTipResponse[0].epoch_no : 0
    );
    res.send(getEpochParamsResponse);
  } catch (error: any) {
    return res
      .status(500)
      .send({ error: "An error occurred in /getepochparams" });
  }
});

// Fallback to React app
app.get("*", (req, res) => {
  res.sendFile("client/build/index.html", { root: "../" });
});

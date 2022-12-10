import axios from "axios";
import {
  AccountAddress,
  AccountInfo,
  EpochParams,
  PoolInfo,
} from "../../client/src/entities/koios.entities";
import {
  GetPools,
  GetTokens,
  ClaimableToken,
  GetRewardsDto,
} from "../../client/src/entities/vm.entities";
import {
  ExtendedMetadata,
  Metadata,
} from "../../client/src/entities/common.entities";
import { GetPricePairs } from "../../client/src/entities/min.entities";
import { CardanoNetwork } from ".";

require("dotenv").config();

let Buffer = require("buffer").Buffer;
const MIN_PAIRS_API =
  process.env.MIN_PAIRS_API ||
  "https://api-mainnet-prod.minswap.org/coinmarketcap/v2/pairs";
const VM_API_TOKEN =
  process.env.VM_API_TOKEN_TESTNET || process.env.VM_API_TOKEN;
const VM_URL = process.env.VM_URL_TESTNET || process.env.VM_URL;
const VM_KOIOS_URL = process.env.KOIOS_URL_TESTNET || process.env.KOIOS_URL;

export async function translateAdaHandle(
  handle: string,
  network: any,
  koiosUrl: string
) {
  let urlPrefix, policyId;

  switch (network) {
    case CardanoNetwork.mainnet:
      urlPrefix = "api";
      policyId = "f0ff48bbb7bbe9d59a40f1ce90e9e9d0ff5002ec48f232b49ca0fb9a";
      break;
    case CardanoNetwork.preview:
    default:
      urlPrefix = "preview";
      // same as mainnet, per $conrad
      policyId = "f0ff48bbb7bbe9d59a40f1ce90e9e9d0ff5002ec48f232b49ca0fb9a";
  }

  handle = handle.slice(1); // remove $
  if (!handle.length) return null; // check if handle is $
  const handleInHex = Buffer.from(handle).toString("hex");
  const url = `${koiosUrl}/asset_address_list?_asset_policy=${policyId}&_asset_name=${handleInHex}`;
  const data = (await axios.get(url)).data;
  if (!data.length) return null;
  const address = data[0].payment_address;
  return address;
}

export async function getFromVM<T>(params: any) {
  return (
    await axios.get<T>(`${VM_URL}/api.php?action=${params}`, {
      headers: { "X-API-Token": `${VM_API_TOKEN}` },
    })
  ).data;
}

export async function getExtendedMetadata(
  metadataUrl: string
): Promise<ExtendedMetadata | undefined> {
  const metadata = (await axios.get<Metadata>(metadataUrl)).data;
  if (metadata?.extended) {
    const extendedMetadata = (
      await axios.get<ExtendedMetadata>(metadata.extended)
    ).data;
    return extendedMetadata;
  }
  return undefined;
}

export async function getFromKoios<T>(action: string, params?: any) {
  if (params) {
    return (await axios.get<T>(`${VM_KOIOS_URL}/${action}?${params}`)).data;
  } else {
    return (await axios.get<T>(`${VM_KOIOS_URL}/${action}`)).data;
  }
}

export async function postFromKoios<T>(action: string, params?: any) {
  if (params) {
    return (await axios.post<T>(`${VM_KOIOS_URL}/${action}`, params)).data;
  } else {
    return (await axios.post<T>(`${VM_KOIOS_URL}/${action}`)).data;
  }
}

export async function getAccountsInfo(stakeAddress: string) {
  return postFromKoios<AccountInfo[]>("account_info", {
    _stake_addresses: [stakeAddress],
  });
}

export async function getAccountsAddresses(stakeAddress: string) {
  return postFromKoios<AccountAddress[]>("account_addresses", {
    _stake_addresses: [stakeAddress],
  });
}

export async function getEpochParams(epochNo: number) {
  return getFromKoios<EpochParams>("epoch_params", `_epoch_no=${epochNo}`);
}

export async function postPoolInfo(pools: string[]) {
  return postFromKoios<PoolInfo[]>("pool_info", { _pool_bech32_ids: pools });
}

export async function getPools() {
  return getFromVM<GetPools>("get_pools");
}

export async function getTokens() {
  return getFromVM<GetTokens>("get_tokens");
}

export async function getPrices() {
  return (await axios.get<GetPricePairs>(MIN_PAIRS_API)).data;
}

export async function getPoolMetadata(accountInfo: any) {
  /**
   * try to get pool metadata
   * if fails, then leave without the metadata
   */
  try {
    let poolInfoObj: any = null;
    let logo = "";

    const poolsInfo = await postPoolInfo([accountInfo.delegated_pool]);
    if (!poolsInfo) throw new Error();

    const poolInfo = poolsInfo[0];
    const extendedMetadata = await getExtendedMetadata(poolInfo.meta_url);
    if (!extendedMetadata) throw new Error();

    poolInfoObj = {
      delegated_pool_name: poolInfo.meta_json.name,
      delegated_pool_description: poolInfo.meta_json.description,
      total_balance: formatTokens(accountInfo.total_balance, 6, 2),
      delegated_pool_ticker: poolInfo.meta_json.ticker,
      delegated_pool_id_bech32: poolInfo.pool_id_bech32,
    };
    logo = extendedMetadata.info.url_png_icon_64x64;
    poolInfoObj = {
      ...poolInfoObj,
      delegated_pool_logo: logo,
    };
    return poolInfoObj;
  } catch (e) {
    return null;
  }
}

export async function getRewards(stakeAddress: string) {
  const getRewardsResponse = await getFromVM<GetRewardsDto>(
    `get_rewards&staking_address=${stakeAddress}`
  );
  if (getRewardsResponse == null) return;
  const tokens = await getTokens();
  if (tokens == null) return;
  const prices = await getPrices();

  const consolidatedAvailableReward: { [key: string]: number } = {};
  const consolidatedAvailableRewardPremium: { [key: string]: number } = {};
  const claimableTokens: ClaimableToken[] = [];

  /**
   * handle regular tokens
   */

  let rewardArray = [
    getRewardsResponse.consolidated_promises,
    getRewardsResponse.consolidated_rewards,
  ];

  if (rewardArray == null) return [];

  rewardArray.forEach((reward: any) => {
    Object.keys(reward).forEach((assetId: string) => {
      if (consolidatedAvailableReward[assetId]) {
        consolidatedAvailableReward[assetId] += reward[assetId];
      } else {
        consolidatedAvailableReward[assetId] = reward[assetId];
      }
    });
  });

  Object.keys(consolidatedAvailableReward).forEach((assetId) => {
    const token = tokens[assetId];
    if (token) {
      claimableTokens.push({
        assetId,
        ticker: token.ticker,
        logo: token.logo,
        decimals: token.decimals,
        amount: consolidatedAvailableReward[assetId],
        premium: false,
        price: tokenPrice(assetId, prices),
      });
    }
  });

  /**
   * handle premium tokens
   */

  if (getRewardsResponse.project_locked_rewards != null) {
    rewardArray = [
      getRewardsResponse.project_locked_rewards.consolidated_promises,
      getRewardsResponse.project_locked_rewards.consolidated_rewards,
    ];
  }

  rewardArray.forEach((reward: any) => {
    Object.keys(reward).forEach((assetId: string) => {
      if (consolidatedAvailableRewardPremium[assetId]) {
        consolidatedAvailableRewardPremium[assetId] += reward[assetId];
      } else {
        consolidatedAvailableRewardPremium[assetId] = reward[assetId];
      }
    });
  });

  Object.keys(consolidatedAvailableRewardPremium).forEach((assetId) => {
    const token = tokens[assetId];
    if (token) {
      claimableTokens.push({
        assetId,
        ticker: token.ticker,
        logo: token.logo,
        decimals: token.decimals,
        amount: consolidatedAvailableRewardPremium[assetId],
        premium: true,
        price: tokenPrice(assetId, prices),
      });
    }
  });

  return claimableTokens;
}

export function formatTokens(
  amount: string | undefined,
  decimals: number | undefined,
  decimalsToShow: number | undefined = decimals
): string {
  decimals = decimals === null ? 6 : decimals;
  if (amount && decimals && decimalsToShow && decimals > 0) {
    if (amount.length > decimals) {
      const decimalPart = amount.substring(amount.length - decimals);
      return (
        amount.substring(0, amount.length - decimals) +
        "." +
        decimalPart.substring(0, decimalsToShow)
      );
    } else {
      const newAmount = amount.padStart(decimals + 1, "0");
      const decimalPart = newAmount.substring(decimals + 1 - amount.length);
      return (
        newAmount.substring(0, newAmount.length - decimals) +
        "." +
        decimalPart.substring(0, decimalsToShow)
      );
    }
  } else {
    return amount || "0";
  }
}

export function tokenPrice(token: string, prices: GetPricePairs): string {
  token = token.replace(".", "");
  const price = prices[token + "_lovelace"];
  console.log("DEBUG: " + token + "_lovelace");
  console.log("DEBUG: " + price["last_price"]);
  if (price) return Number(price["last_price"]).toFixed(6).replace(/0*$/, "");
  return "N/A";
}

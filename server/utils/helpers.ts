import axios from "axios";
import converter from "bech32-converting";
import { CardanoNetwork } from ".";
import {
  DeliveredReward,
  ExtendedMetadata,
  Metadata,
} from "../../client/src/entities/common.entities";
import {
  AccountAddress,
  AccountInfo,
  EpochParams,
  PoolInfo,
} from "../../client/src/entities/koios.entities";
import { GetPricePairs } from "../../client/src/entities/min.entities";
import {
  ClaimableToken,
  GetPools,
  GetRewardsDto,
  VmDeliveredReward,
  VmTokenInfoMap,
} from "../../client/src/entities/vm.entities";
import { longTermCache, shortTermCache } from "./cache";

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
  let pools: GetPools | undefined = longTermCache.get("pools");
  if (pools == null) {
    pools = await getFromVM<GetPools>("get_pools");
    longTermCache.set("pools", pools);
  }
  Object.values(pools).forEach((pool) => {
    pool.id = convertPoolIdToBech32(pool.id);
  });
  return pools;
}

export async function getTokens(): Promise<VmTokenInfoMap> {
  let tokenInfo = longTermCache.get<VmTokenInfoMap>("tokenInfo");
  if (tokenInfo == null) {
    tokenInfo = await getFromVM<VmTokenInfoMap>("get_tokens");
    longTermCache.set("tokenInfo", tokenInfo);
  }
  return tokenInfo;
}

export async function getPrices(): Promise<GetPricePairs> {
  let prices = shortTermCache.get("prices") as GetPricePairs;
  if (prices == null) {
    prices = (await axios.get<GetPricePairs>(MIN_PAIRS_API)).data;
    shortTermCache.set("prices", prices);
  }
  return prices;
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
  const [getRewardsResponse, tokens, prices] = await Promise.all([
    getFromVM<GetRewardsDto>(`get_rewards&staking_address=${stakeAddress}`),
    getTokens(),
    getPrices(),
  ]);
  if (getRewardsResponse == null) return;
  if (tokens == null) return;

  const consolidatedAvailableReward: { [key: string]: number } = {};
  const consolidatedAvailableRewardPremium: { [key: string]: number } = {};
  const claimableTokens: ClaimableToken[] = [];

  /** handle regular tokens */
  const regularRewards: Record<string, number> = {
    ...getRewardsResponse.consolidated_promises,
    ...getRewardsResponse.consolidated_rewards,
  };

  Object.entries(regularRewards).forEach(([assetId, amount]) => {
    if (consolidatedAvailableReward[assetId]) {
      consolidatedAvailableReward[assetId] += amount;
    } else {
      consolidatedAvailableReward[assetId] = amount;
    }
  });

  /** handle premium tokens */
  const premiumRewards: Record<string, number> = {
    ...(getRewardsResponse.project_locked_rewards?.consolidated_promises ?? {}),
    ...(getRewardsResponse.project_locked_rewards?.consolidated_rewards ?? {}),
  };

  Object.entries(premiumRewards).forEach(([assetId, amount]) => {
    if (consolidatedAvailableRewardPremium[assetId]) {
      consolidatedAvailableRewardPremium[assetId] += amount;
    } else {
      consolidatedAvailableRewardPremium[assetId] = amount;
    }
  });

  Object.keys(consolidatedAvailableReward).forEach((assetId) => {
    const token = tokens[assetId];
    const { decimals: tokenDecimals, logo, ticker } = token;
    const decimals = Number(tokenDecimals);
    const amount =
      consolidatedAvailableReward[assetId] / Math.pow(10, decimals);
    const { price, total } = getTokenValue(assetId, amount, prices);
    if (token) {
      claimableTokens.push({
        assetId,
        ticker,
        logo,
        decimals,
        amount,
        premium: false,
        price,
        total,
      });
    }
  });

  Object.keys(consolidatedAvailableRewardPremium).forEach((assetId) => {
    const token = tokens[assetId];
    const { decimals: tokenDecimals, logo, ticker } = token;
    const decimals = Number(tokenDecimals);
    const amount =
      consolidatedAvailableRewardPremium[assetId] / Math.pow(10, decimals);
    const { price, total } = getTokenValue(assetId, amount, prices);
    if (token) {
      claimableTokens.push({
        assetId,
        ticker,
        logo,
        decimals,
        amount,
        premium: true,
        price,
        total,
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

export function getTokenValue(
  assetId: string,
  amount: number,
  prices: GetPricePairs
): {
  price: string;
  total: string;
} {
  assetId = assetId.replace(".", "");
  if (assetId === "lovelace") {
    return {
      price: "1₳",
      total: `${amount}₳`,
    };
  }
  const price = prices[assetId + "_lovelace"]?.last_price;
  if (price && amount) {
    return {
      price: `${Number(price).toFixed(10)}₳`,
      total: `${(Number(price) * amount).toFixed(10)}₳`,
    };
  }
  return {
    price: "N/A",
    total: "N/A",
  };
}

export async function getDeliveredRewards(
  stakingAddress: string
): Promise<DeliveredReward[]> {
  const [vmDeliveredRewards, tokenInfo] = await Promise.all([
    getFromVM<VmDeliveredReward[]>(
      `delivered_rewards&staking_address=${stakingAddress}`
    ),
    getTokens(),
  ]);
  return parseVmDeliveredRewards(vmDeliveredRewards, tokenInfo);
}

export function parseVmDeliveredRewards(
  vmDeliveredRewards: VmDeliveredReward[],
  tokenInfo: VmTokenInfoMap
): DeliveredReward[] {
  type RewardMap = Record<string, DeliveredReward>;
  const rewardMap: RewardMap = {};

  for (let vmDeliveredReward of vmDeliveredRewards) {
    const { token, delivered_on, amount } = vmDeliveredReward;
    let ticker: string;
    if (token === "lovelace") {
      ticker = "ADA";
    } else {
      ticker = Buffer.from(token.split(".")[1], "hex").toString("utf8");
    }

    const key = `${delivered_on}_${ticker}`;
    let decimals = 0;

    if (tokenInfo[token]?.decimals) {
      decimals = Number(tokenInfo[token].decimals);
    }

    const tokenAmount = Number(amount) / Math.pow(10, decimals);

    if (rewardMap[key]) {
      rewardMap[key].amount += tokenAmount;
    } else {
      rewardMap[key] = {
        token: token,
        amount: tokenAmount,
        delivered_on: delivered_on,
        ticker,
        decimals,
      };
    }
  }

  return Object.values(rewardMap);
}

export function convertPoolIdToBech32(poolIdInHex: string) {
  return converter("pool").toBech32(poolIdInHex);
}

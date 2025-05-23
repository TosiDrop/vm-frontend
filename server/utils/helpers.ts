import axios from "axios";
import converter from "bech32-converting";
import validator from "validator";
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
import {
  ClaimableToken,
  GetRewardsDto,
  VmDeliveredReward,
  VmTokenInfoMap,
} from "../../client/src/entities/vm.entities";
import { longTermCache, shortTermCache } from "./cache";
import { HttpStatusCode, createErrorWithCode } from "./error";

require("dotenv").config();

let Buffer = require("buffer").Buffer;
const VM_API_TOKEN =
  process.env.VM_API_TOKEN_TESTNET || process.env.VM_API_TOKEN;
const VM_URL = process.env.VM_URL_TESTNET || process.env.VM_URL;
const VM_KOIOS_URL = process.env.KOIOS_URL_TESTNET || process.env.KOIOS_URL;

export function sanitizeString(input: string) {
  let output: string = input;
  output = validator.escape(input);
  return output;
}

export async function translateAdaHandle(
  handle: string,
  network: any,
  koiosUrl: string,
) {
  let urlPrefix, policyId: string;

  handle = handle.toLowerCase();

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

  handle = handle.slice(1);
  if (handle.length === 0) {
    throw createErrorWithCode(
      HttpStatusCode.BAD_REQUEST,
      "Handle is malformed",
    );
  }
  const handleInHex: string = Buffer.from(handle).toString("hex");
  const address222: string = await resolveAddress(
    "000de140" + handleInHex,
    policyId,
    koiosUrl,
  );
  if (address222) return address222;
  const address314: string = await resolveAddress(
    "0013ab30" + handleInHex,
    policyId,
    koiosUrl,
  );
  if (address314) return address314;

  const address = await resolveAddress(handleInHex, policyId, koiosUrl);
  if (address) return address;
  else
    throw createErrorWithCode(
      HttpStatusCode.NOT_FOUND,
      "Handle does not exist",
    );

  async function resolveAddress(
    handleInHex: string,
    policyId: string,
    koiosUrl: string,
  ) {
    const url = `${koiosUrl}/asset_addresses?_asset_policy=${policyId}&_asset_name=${handleInHex}`;

    const data = (await axios.get(url)).data;

    if (data.length === 0) {
      return null;
    }

    const address = data[0].payment_address;
    return address;
  }
}

export async function getFromVM<T>(params: any) {
  return (
    await axios.get<T>(`${VM_URL}/api.php?action=${params}`, {
      headers: { "X-API-Token": `${VM_API_TOKEN}` },
    })
  ).data;
}

export async function getExtendedMetadata(
  metadataUrl: string,
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

export async function getTokens(options?: {
  flushCache?: boolean;
}): Promise<VmTokenInfoMap> {
  let tokenInfo: VmTokenInfoMap;

  if (options?.flushCache) {
    tokenInfo = await getFromVM<VmTokenInfoMap>("get_tokens");
    longTermCache.set("tokenInfo", tokenInfo);
  } else {
    const tempTokenInfo = longTermCache.get("tokenInfo") as VmTokenInfoMap;
    if (tempTokenInfo == null) {
      tokenInfo = await getFromVM<VmTokenInfoMap>("get_tokens");
      longTermCache.set("tokenInfo", tokenInfo);
    } else {
      tokenInfo = tempTokenInfo;
    }
  }

  return tokenInfo;
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
  let [getRewardsResponse, tokens] = await Promise.all([
    getFromVM<GetRewardsDto>(`get_rewards&staking_address=${stakeAddress}`),
    getTokens(),
  ]);

  const claimableTokens: ClaimableToken[] = [];
  if (getRewardsResponse == null) return claimableTokens;
  if (tokens == null) return claimableTokens;

  const consolidatedAvailableReward: { [key: string]: number } = {};

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

  /** handle locked tokens */
  const lockedRewards: Record<string, number> = {
    ...(getRewardsResponse.project_locked_rewards?.consolidated_promises ?? {}),
    ...(getRewardsResponse.project_locked_rewards?.consolidated_rewards ?? {}),
  };

  Object.entries(lockedRewards).forEach(([assetId, amount]) => {
    if (consolidatedAvailableReward[assetId]) {
      consolidatedAvailableReward[assetId] += amount;
    } else {
      consolidatedAvailableReward[assetId] = amount;
    }
  });

  /** if there is no token info in the map, flush the cache and re-fetch token info */
  for (const assetId of [...Object.keys(consolidatedAvailableReward)]) {
    const token = tokens[assetId];
    if (token == null) {
      tokens = await getTokens({ flushCache: true });
    }
  }

  Object.keys(consolidatedAvailableReward).forEach((assetId) => {
    const token = tokens[assetId];
    /** add default values just to be safe */
    const { decimals: tokenDecimals = 0, logo = "", ticker = "" } = token;
    const decimals = Number(tokenDecimals);
    const amount =
      consolidatedAvailableReward[assetId] / Math.pow(10, decimals);
    if (token) {
      claimableTokens.push({
        assetId,
        ticker,
        logo,
        decimals,
        amount,
      });
    }
  });

  return claimableTokens;
}

export function formatTokens(
  amount: string | undefined,
  decimals: number | undefined,
  decimalsToShow: number | undefined = decimals,
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

export async function getDeliveredRewards(
  stakingAddress: string,
): Promise<DeliveredReward[]> {
  const [vmDeliveredRewards, tokenInfo] = await Promise.all([
    getFromVM<VmDeliveredReward[]>(
      `delivered_rewards&staking_address=${stakingAddress}`,
    ),
    getTokens(),
  ]);
  return parseVmDeliveredRewards(vmDeliveredRewards, tokenInfo);
}

export function parseVmDeliveredRewards(
  vmDeliveredRewards: VmDeliveredReward[],
  tokenInfo: VmTokenInfoMap,
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

export function convertHexToBuffer(_: string): Uint8Array {
  return Buffer.from(_, "hex");
}

import { DeliveredReward } from "./common.entities";
import { EpochParams, Tip } from "./koios.entities";
import { Assets, ClaimableToken, PoolInfo, VmPoolInfo } from "./vm.entities";

export interface GetRewardsDto {
  claimable_tokens: ClaimableToken[];
  pool_info: VmPoolInfo;
  total_rewards?: number;
  consolidated_promises?: Assets;
  consolidated_rewards?: Assets;
  nfts?: any[];
  assets?: Assets;
  min_balance?: number;
  vending_address?: string;
  withdrawal_fee?: string;
  withdraw_all_tokens_deposit?: number;
  project_locked_rewards?: {
    consolidated_promises: Assets;
    consolidated_rewards: Assets;
    nfts: any[];
    assets: Assets;
  };
}

export interface GetQueueDto {
  pending_tx: number;
}

export interface GetPoolsDto {
  whitelistedPools: PoolInfo[];
  regularPools: PoolInfo[];
}

export interface GetDeliveredRewardsDto {
  deliveredRewards: DeliveredReward[];
}

export interface ServerErrorDto {
  error: string;
}

export namespace StakeTxDto {
  export interface GetTxRequest {
    poolId: string;
    address: string;
  }

  export interface GetTxResponse {
    witness: string;
    txBody: string;
  }

  export interface PostSignedTxRequest {
    signedWitness: string;
    txBody: string;
  }

  export interface PostSignedTxResponse {
    tx: string;
  }
}

export interface GetPopupInfoDto {
  title: string;
  text: string;
  buttonText: string;
  buttonLink: string;
}

export namespace ProjectsDto {
  export interface Url {
    website?: string;
    medium?: string;
    twitter?: string;
    discord?: string;
    telegram?: string;
    paper?: string;
    docs?: string;
    github?: string;
    cardanoScan?: string;
    poolpm?: string;
  }

  export interface Logo {
    logoDefault: string;
    logoDark?: string;
    logoCompact?: string;
    logoCompactDark?: string;
  }

  export interface Desc {
    descShort: string;
    descLong?: string;
    claimDesc?: string;
  }

  export interface TokenInfo {
    token: string;
    totalSupply?: number;
    policyID: string;
  }

  export interface GetProjects {
    logos: Logo;
    descs: Desc;
    token: TokenInfo;
    urls: Url;
  }
}

export type GetEpochParamsDto = EpochParams;

export type GetTipDto = Tip;

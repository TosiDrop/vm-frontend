import { DeliveredReward } from "./common.entities";
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

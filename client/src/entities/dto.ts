import { DeliveredReward } from "./common.entities";
import { PoolInfo } from "./vm.entities";

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

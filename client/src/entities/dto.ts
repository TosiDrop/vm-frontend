import { PoolInfo } from "./vm.entities";

export interface GetQueueDto {
  pending_tx: number;
}

export interface GetPoolsDto {
  whitelistedPools: PoolInfo[];
  regularPools: PoolInfo[];
}

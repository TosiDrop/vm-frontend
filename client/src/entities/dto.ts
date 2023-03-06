import { DeliveredReward, TransactionStatusDetail } from "./common.entities";
import { EpochParams, Tip } from "./koios";
import { PricePair } from "./min.entities";
import { ProjectData } from "./project.entities";
import { ClaimableToken, PoolInfo, VmPoolInfo, VmTokenInfoMap } from "./vm";

export namespace Dto {
  export interface BaseDto {
    response: object;
    body: object;
    query: object;
  }

  export interface GetTxStatus extends BaseDto {
    query: {
      request_id: string;
      session_id: string;
    };
    response: {
      status: TransactionStatusDetail;
      expected_deposit: number;
      deposit: number;
    };
  }

  export interface GetQueue extends BaseDto {
    response: {
      pending_tx: number;
    };
  }

  export interface GetPopUpInfo extends BaseDto {
    response: {
      title: string;
      text: string;
      buttonText: string;
      buttonLink: string;
    };
  }

  export interface GetProjects extends BaseDto {
    response: ProjectData[];
  }

  export interface GetEpochParams extends BaseDto {
    response: EpochParams;
  }

  export interface GetTip extends BaseDto {
    response: Tip;
  }

  export interface GetDeliveredRewards extends BaseDto {
    query: {
      staking_address: string;
    };
    response: {
      deliveredRewards: DeliveredReward[];
    };
  }

  export interface GetCustomRewards extends BaseDto {
    query: {
      staking_address: string;
      session_id: string;
      selected: string;
      unlock: string;
    };
    response: {
      request_id: string;
      deposit: number;
      overhead_fee: number;
      withdrawal_address: string;
      is_whitelisted: boolean;
    };
  }

  export interface GetPrices extends BaseDto {
    response: Record<string, PricePair>;
  }

  export interface ServerError extends BaseDto {
    response: {
      error: string;
    };
  }

  export interface GetPools extends BaseDto {
    response: {
      whitelistedPools: PoolInfo[];
      regularPools: PoolInfo[];
    };
  }

  export interface GetTokens extends BaseDto {
    response: VmTokenInfoMap;
  }

  export interface GetSettings extends BaseDto {
    response: {
      withdrawal_fee: number;
      epoch: number;
      switching_epoch: boolean;
      frontend_version: string;
      backend_version: string;
      min_balance: number;
      confirmations_required: number;
    };
  }

  export interface GetSystemInfo extends BaseDto {
    response: {
      backend_up: boolean;
      ntds_up: boolean;
      pending_tx: number;
      pending_rewards: number;
      pending_promises: number;
      tracked_stake: number;
      tracked_delegators: number;
      delivered_rewards: number;
      pending_withdrawals: number;
      processed_withdrawals: number;
      failed_withdrawals: number;
      uptime: string;
      uptime_ntds: string;
      xwallet_size: number;
      epoch: number;
    };
  }

  export interface GetHealth extends BaseDto {
    response: {
      status: string;
    };
  }

  export interface GetHealthz extends BaseDto {
    response: {
      status: string;
    };
  }

  export interface GetFeatures extends BaseDto {
    response: {
      tosi_fee: number;
      tosi_fee_whitelist: string;
      claim_enabled: boolean;
      network: string;
      ergo_enabled: boolean;
    };
  }

  export interface GetStakeKey extends BaseDto {
    query: {
      address: string;
    };
    response: {
      staking_address: string;
    };
  }

  export interface GetRewards extends BaseDto {
    query: {
      address: string;
    };
    response: {
      claimable_tokens: ClaimableToken[] | undefined;
      pool_info: VmPoolInfo;
    };
  }

  export interface CreateStakeTx extends BaseDto {
    query: {
      poolId: string;
      address: string;
    };
    response: {
      witness: string;
      txBody: string;
    };
  }

  export interface SubmitTx extends BaseDto {
    body: {
      signedWitness: string;
      txBody: string;
    };

    response: {
      tx: string;
    };
  }

  export interface ServerError extends BaseDto {
    response: {
      error: string;
    };
  }
}

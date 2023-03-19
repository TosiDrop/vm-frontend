import { DeliveredReward } from "./common.entities";
import { MinswapTypes } from "./minswap";
import { VmTypes } from "./vm";
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

export namespace Dto {
  export interface Base {
    query: {};
    body: {};
    response: {};
  }

  export interface CreateTransferTx extends Base {
    body: {
      fromAddress: string;
      toAddress: string;
      amountToSend: string;
    };

    response: {
      witness: string;
      txBody: string;
    };
  }

  export interface CreateDelegationTx extends Base {
    body: {
      poolId: string;
      address: string;
    };

    response: {
      witness: string;
      txBody: string;
    };
  }

  export interface SubmitTx extends Base {
    body: {
      signedWitness: string;
      txBody: string;
    };

    response: {
      tx: string;
    };
  }

  export interface GetBech32Address extends Base {
    query: {
      addressInHex: string;
    };
    response: {
      addressInBech32: string;
    };
  }

  export interface GetVmSettings extends Base {
    response: VmTypes.Settings;
  }

  export interface GetMinswapPriceInfoMap extends Base {
    response: MinswapTypes.PriceInfoMap;
  }
  
  export interface PostBannerText extends Base {
    body: {
      text: string;
      adminKey: string;
    };
  }

  export interface GetBannerText extends Base {
    response: {
      text: string;
    };
  }
}

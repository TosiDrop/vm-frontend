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

export interface GetCustomRewards {
  request_id: string;
  deposit: number;
  overhead_fee?: number;
  withdrawal_address: string;
  is_whitelisted: boolean;
}

/**
 * @deprecated {@link VmDeliveredReward}
 * there should not be a verb in basic entity definition. Also, let's start
 * adding prefix 'Vm' to indicate entities from VM
 */
export interface GetRewardsHistory {
  id: string;
  staking_address: string;
  epoch: string;
  token: string;
  amount: string;
  withdrawal_request: string;
  expiry_return_pool_id: string | null;
  expiry: string;
  return_policy: string;
  delivered_on: string;
}

export interface VmDeliveredReward {
  id: string;
  staking_address: string;
  epoch: string;
  token: string;
  amount: string;
  withdrawal_request: string;
  expiry_return_pool_id: string | null;
  expiry: string;
  return_policy: string;
  delivered_on: string;
}

export interface SanitizeAddress {
  staking_address: string;
}

export interface Assets {
  [key: string]: number;
}

export interface ClaimableToken {
  assetId: string;
  ticker: string;
  logo: string;
  decimals: number;
  amount: number;
  premium: boolean;
  price: string;
  total: string;
  selected?: boolean;
}

export interface GetTokens {
  [key: string]: TokenInfo;
}

/**
 * @deprecated {@link VmTokenInfo}
 * should use 'Vm' prefix if coming from vm
 */
export interface TokenInfo {
  id: string;
  enabled: string;
  name: string;
  ticker: string;
  logo: string;
  decimals: number;
  visible: string;
  info: string;
}

export interface VmTokenInfo {
  id: string;
  enabled: string;
  name: string;
  ticker: string;
  logo: string;
  decimals: string;
  visible: string;
  info: string | null;
}

type PoolVisibility = "t" | "f";

export interface PoolInfo {
  id: string;
  ticker: string;
  name: string;
  enabled: string;
  logo: string;
  last_delegator_refresh: string;
  loading_addr: string;
  description: string;
  visible: PoolVisibility;
  delegator_count: string;
}

export type VmTokenInfoMap = Record<string, VmTokenInfo>;

export namespace VmTypes {
  export interface CustomRewards {
    request_id: string;
    deposit: number;
    overhead_fee: number;
    withdrawal_address: string;
    is_whitelisted: boolean;
  }

  export interface Settings {
    withdrawal_fee: number;
    epoch: number;
    switching_epoch: boolean;
    frontend_version: string;
    backend_version: string;
    min_balance: number;
    confirmations_required: number;
  }
}

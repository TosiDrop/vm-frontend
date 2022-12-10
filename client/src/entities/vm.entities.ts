export interface GetRewardsDto {
  claimable_tokens: ClaimableToken[];
  pool_info: {
    delegated_pool_name: string;
    delegated_pool_description: string;
    total_balance: string;
    delegated_pool_ticker: string;
    delegated_pool_logo: string;
  };
  total_rewards?: number;
  consolidated_promises?: Assets;
  consolidated_rewards?: Assets;
  nfts?: any[];
  assets?: Assets;
  min_balance?: number;
  vending_address?: string;
  withdrawal_fee?: string;
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
  selected?: boolean;
  price?: string;
}

export interface GetTokens {
  [key: string]: TokenInfo;
}

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

export interface GetPools {
  [key: string]: PoolInfo;
}

export interface PoolInfo {
  id: string;
  ticker: string;
  name: string;
  enabled: string;
  logo: string;
  last_delegator_refresh: string;
  loading_addr: string;
  description: string;
  visible: string;
  delegator_count: string;
}

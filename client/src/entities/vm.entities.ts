export interface GetRewards {
    total_rewards: number;
    consolidated_promises: Assets;
    consolidated_rewards: Assets;
    nfts: any[];
    assets: Assets;
    min_balance: number;
    vending_address: string;
    withdrawal_fee: string;
    claimable_tokens: ClaimableToken[];
    pool_info: {
        delegated_pool_name: string;
        delegated_pool_description: string;
        total_balance: string;
        delegated_pool_ticker: string;
        delegated_pool_logo: string;
    };
}

export interface SanitizeAddress {
    staking_address: string;
}

export interface Assets {
    [key: string]: number;
}

export interface ClaimableToken {
    assetId: string,
    ticker: string,
    logo: string,
    decimals: number,
    amount: number
}

export interface GetTokens {
    [key: string]: TokenInfo;
}

export interface TokenInfo {
    id: string,
    enabled: string,
    name: string,
    ticker: string,
    logo: string,
    decimals: number,
    visible: string,
    info: string
}

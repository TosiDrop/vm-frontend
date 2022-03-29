export interface AccountInfo {
    status: string;
    delegated_pool: string;
    total_balance: string;
    utxo: string;
    rewards: string;
    withdrawals: string;
    rewards_available: string;
    reserves: string;
    treasury: string;
}

export interface AccountPoolInfo {
    delegated_pool: string
    reserves: string
    rewards: string
    rewards_available: string
    status: string
    total_balance: string
    treasury: string
    utxo: string
    withdrawals: string
}
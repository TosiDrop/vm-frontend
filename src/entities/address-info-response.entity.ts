export interface GetRewards {
    total_rewards:         number;
    consolidated_promises: Assets;
    consolidated_rewards:  any[];
    nfts:                  any[];
    assets:                Assets;
    min_balance:           number;
    vending_address:       string;
    withdrawal_fee:        string;
}

export interface Assets {
    lovelace: number;
}

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

export interface AccountRewards {
    earned_epoch: number;
    spendable_epoch: number;
    amount: string;
    type: string;
    pool_id: string;
}

export interface EpochInfo {
    epoch_no: number;
    out_sum: string;
    fees: string;
    tx_count: number;
    blk_count: number;
    start_time: Date;
    end_time: Date;
    first_block_time: Date;
    last_block_time: Date;
    active_stake: string;
}

export interface PoolInfo {
    pool_id_bech32: string;
    pool_id_hex: string;
    active_epoch_no: number;
    vrf_key_hash: string;
    margin: number;
    fixed_cost: string;
    pledge: string;
    reward_addr: string;
    owners: string[];
    relays: Relay[];
    meta_url: string;
    meta_hash: string;
    meta_json: MetaJSON;
    pool_status: string;
    retiring_epoch: null;
    op_cert: string;
    op_cert_counter: number;
    active_stake: string;
    block_count: number;
    live_pledge: string;
    live_stake: string;
    live_delegators: number;
    live_saturation: number;
}

export interface MetaJSON {
    name: string;
    ticker: string;
    homepage: string;
    description: string;
}

export interface Relay {
    dns: string;
    srv: string;
    ipv4: string;
    ipv6: string;
    port: number;
}

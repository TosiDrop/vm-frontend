export namespace KoiosTypes {
  export type AccountStatus = "registered" | "not registered";

  export interface AccountInfo {
    stake_address: string;
    status: AccountStatus;
    delegated_pool: string;
    total_balance: string;
    utxo: string;
    rewards: string;
    withdrawals: string;
    rewards_available: string;
    reserves: string;
    treasury: string;
  }

  export interface EpochProtocolParameters {
    epoch_no: number;
    min_fee_a: number;
    min_fee_b: number;
    max_block_size: number;
    max_tx_size: number;
    max_bh_size: number;
    key_deposit: string;
    pool_deposit: string;
    max_epoch: number;
    optimal_pool_count: number;
    influence: number;
    monetary_expand_rate: number;
    treasury_growth_rate: number;
    decentralisation: number;
    extra_entropy: string;
    protocol_major: number;
    protocol_minor: number;
    min_utxo_value: string;
    min_pool_cost: string;
    nonce: string;
    block_hash: string;
    cost_models: string;
    price_mem: number;
    price_step: number;
    max_tx_ex_mem: number;
    max_tx_ex_steps: number;
    max_block_ex_mem: number;
    max_block_ex_steps: number;
    max_val_size: number;
    collateral_percent: number;
    max_collateral_inputs: number;
    coins_per_utxo_size: string;
  }

  export interface EpochInformation {
    epoch_no: number;
    out_sum: string;
    fees: string;
    tx_count: number;
    blk_count: number;
    start_time: number;
    end_time: number;
    first_block_time: number;
    last_block_time: number;
    active_stake: string;
    total_rewards: string;
    avg_blk_reward: string;
  }

  export interface BlockchainTip {
    hash: string;
    epoch_no: number;
    abs_slot: number;
    epoch_slot: number;
    block_no: number;
    block_time: number;
  }

  export interface AddressInformation {
    address: string;
    balance: string;
    stake_address: string | null;
    script_address: boolean;
    utxo_set: UTxO[];
  }

  export interface NativeToken {
    policy_id: string;
    asset_name: string;
    fingerprint: string;
    quantity: string;
  }

  export interface UTxO {
    value: string;
    tx_hash: string;
    tx_index: string;
    asset_list: NativeToken[];
  }
}

export interface AccountInfo {
  stake_address?: string;
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

export interface AccountAddress {
  address: string;
}

export interface AccountPoolInfo {
  delegated_pool: string;
  reserves: string;
  rewards: string;
  rewards_available: string;
  status: string;
  total_balance: string;
  treasury: string;
  utxo: string;
  withdrawals: string;
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

export interface EpochParams {
  epoch_no: number;
  min_fee_a: number;
  min_fee_b: number;
  max_block_size: number;
  max_tx_size: number;
  max_bh_size: number;
  key_deposit: number;
  pool_deposit: number;
  max_epoch: number;
  optimal_pool_count: number;
  influence: number;
  monetary_expand_rate: number;
  treasury_growth_rate: number;
  decentralisation: number;
  entropy: string | null;
  protocol_major: number;
  protocol_minor: number;
  min_utxo_value: number;
  min_pool_cost: number;
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
  coins_per_utxo_size: number;
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

export interface TransactionStatus {
  tx_hash: string;
  num_confirmations: number | null;
}

export interface AddressTransactions {
  tx_hash: string;
  block_height: number;
  block_time: Date;
}

export interface TransactionInfo {
  tx_hash: string;
  block_hash: string;
  block_height: number;
  epoch: number;
  epoch_slot: number;
  absolute_slot: number;
  tx_timestamp: Date;
  tx_block_index: number;
  tx_size: number;
  total_output: string;
  fee: string;
  deposit: string;
  invalid_before: null;
  invalid_after: number;
  collaterals: any[];
  inputs: Put[];
  outputs: Put[];
  withdrawals: any[];
  assets_minted: any[];
  metadata: any[];
  certificates: Certificate[];
  native_scripts: any[];
  plutus_contracts: any[];
}

export interface Certificate {
  index: number;
  type: string;
  info: Info;
}

export interface Info {
  stake_address: string;
  pool_id_bech32: string;
  pool_id_hex: string;
}

export interface Put {
  payment_addr: PaymentAddr;
  stake_addr: string;
  tx_hash: string;
  tx_index: number;
  value: string;
  asset_list: {
    policy_id: string;
    asset_name: string;
    quantity: string;
  }[];
}

export interface PaymentAddr {
  bech32: string;
  cred: string;
}

export interface Tip {
  hash: string;
  epoch_no: number;
  abs_slot: number;
  epoch_slot: number;
  block_no: number;
  block_time: Date;
}

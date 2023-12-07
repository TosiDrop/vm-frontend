export enum CardanoNetwork {
  preview = "preview",
  mainnet = "mainnet",
}

export interface IVMSettings {
  withdrawal_fee: number;
  epoch: number;
  switching_epoch: boolean;
  frontend_version: string;
  backend_version: string;
  min_balance: number;
  confirmations_required: number;
}

export interface ITosiFeatures {
  tosi_fee: number;
  tosi_fee_whitelist: any;
  claim_enabled: boolean;
  native_token_fee: number;
  native_token_id: any;
  network: string;
  ergo_enabled: boolean;
}

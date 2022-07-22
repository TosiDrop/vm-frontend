export enum CardanoNetwork {
  mainnet = "mainnet",
  testnet = "testnet",
}

export interface ISettings {
  withdrawal_fee: number;
  epoch: number;
  switching_epoch: boolean;
  frontend_version: string;
  backend_version: string;
  min_balance: number;
  confirmations_required: number;
  tosi_fee: number;
  tosi_fee_whitelist: any;
}

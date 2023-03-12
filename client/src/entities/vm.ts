export namespace VmTypes {
  export interface Settings {
    withdrawal_fee: number;
    epoch: number;
    switching_epoch: boolean;
    frontend_version: string;
    backend_version: string;
    min_balance: number;
    confirmations_required: number;
    max_assets_in_request?: number;
  }
}

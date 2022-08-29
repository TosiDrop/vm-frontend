type Address = string;

export interface ICustomRewards {
  request_id: string;
  deposit: number;
  overhead_fee: number;
  withdrawal_address: Address;
  is_whitelisted: boolean;
}

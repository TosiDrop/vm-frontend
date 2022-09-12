import { TransactionStatus } from "src/entities/koios.entities";
import { GetRewardsDto, GetCustomRewards } from "../entities/vm.entities";
import axios from "axios";

export async function getRewards(
  address: string
): Promise<GetRewardsDto | undefined> {
  const response = await axios.get(`/getrewards?address=${address}`);
  if (response && response.data) {
    return response.data;
  }
  return undefined;
}

export async function getCustomRewards(
  staking_address: string,
  session_id: string,
  selected: string,
  unlock: boolean
): Promise<GetCustomRewards | undefined> {
  const response = await axios.get(
    `/getcustomrewards?staking_address=${staking_address}&session_id=${session_id}&selected=${selected}&unlock=${
      unlock ? "true" : "false"
    }`
  );
  if (response && response.data) {
    return response.data;
  }
  return undefined;
}

export async function getTransactionStatus(
  txHash: string
): Promise<TransactionStatus[] | undefined> {
  const response = await axios.get(`/gettransactionstatus?txHash=${txHash}`);
  if (response && response.data) {
    return response.data;
  }
  return undefined;
}

export async function getTxStatus(request_id: string, session_id: string) {
  const response = await axios.get(
    `/txstatus?request_id=${request_id}&session_id=${session_id}`
  );
  return response.data;
}

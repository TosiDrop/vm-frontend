import axios from "axios";
import { GetDeliveredRewardsDto } from "src/entities/dto";
import { TransactionStatus } from "src/entities/koios.entities";
import { GetCustomRewards, GetRewardsDto } from "../entities/vm.entities";

const API_URL = process.env.REACT_APP_CLAIM_API || "http://localhost:3000";

export async function getRewards(
  address: string,
): Promise<GetRewardsDto | undefined> {
  const response = await axios.get(
    `${API_URL}/api/getrewards?address=${address}`,
  );
  if (response && response.data) {
    return response.data;
  }
  return undefined;
}

export async function getCustomRewards(
  staking_address: string,
  session_id: string,
  selected: string,
  unlock: boolean,
  native: boolean,
): Promise<GetCustomRewards | undefined> {
  const response = await axios.get(
    `${API_URL}/api/getcustomrewards?staking_address=${staking_address}&session_id=${session_id}&selected=${selected}&unlock=${
      unlock ? "true" : "false"
    }&native=${native ? "true" : "false"}`,
  );
  if (response && response.data) {
    return response.data;
  }
  return undefined;
}

export async function getDeliveredRewards(
  stakingAddress: string,
): Promise<GetDeliveredRewardsDto> {
  const response = await axios.get(
    `${API_URL}/api/getdeliveredrewards?staking_address=${stakingAddress}`,
  );
  return response.data;
}

export async function getTransactionStatus(
  txHash: string,
): Promise<TransactionStatus[] | undefined> {
  const response = await axios.get(
    `${API_URL}/api/gettransactionstatus?txHash=${txHash}`,
  );
  if (response && response.data) {
    return response.data;
  }
  return undefined;
}

export async function getTxStatus(request_id: string, session_id: string) {
  const response = await axios.get(
    `${API_URL}/api/txstatus?request_id=${request_id}&session_id=${session_id}`,
  );
  return response.data;
}

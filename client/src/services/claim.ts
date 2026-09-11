import axios from "axios";
import { GetDeliveredRewardsDto } from "src/entities/dto";
import { TransactionStatus } from "src/entities/koios.entities";
import { GetCustomRewards, GetRewardsDto } from "../entities/vm.entities";

const API_URL = process.env.REACT_APP_CLAIM_API || "http://localhost:3000";

export async function getRewards(
  address: string,
): Promise<GetRewardsDto | undefined> {
  const params = new URLSearchParams({ address });
  const response = await axios.get(`${API_URL}/api/getrewards?${params}`);
  if (response && response.data) {
    return response.data;
  }
  return undefined;
}

export async function getCustomRewards(
  staking_address: string,
  session_id: string,
  selected: string,
): Promise<GetCustomRewards | undefined> {
  const params = new URLSearchParams({
    staking_address,
    session_id,
    selected,
    unlock: "true",
    native: "false",
  });
  const response = await axios.get(`${API_URL}/api/getcustomrewards?${params}`);
  if (response && response.data) {
    return response.data;
  }
  return undefined;
}

export async function getDeliveredRewards(
  stakingAddress: string,
): Promise<GetDeliveredRewardsDto> {
  const params = new URLSearchParams({ staking_address: stakingAddress });
  const response = await axios.get(
    `${API_URL}/api/getdeliveredrewards?${params}`,
  );
  return response.data;
}

export async function getTransactionStatus(
  txHash: string,
): Promise<TransactionStatus[] | undefined> {
  const params = new URLSearchParams({ txHash });
  const response = await axios.get(
    `${API_URL}/api/gettransactionstatus?${params}`,
  );
  if (response && response.data) {
    return response.data;
  }
  return undefined;
}

export async function getTxStatus(request_id: string, session_id: string) {
  const params = new URLSearchParams({ request_id, session_id });
  const response = await axios.get(`${API_URL}/api/txstatus?${params}`);
  return response.data;
}

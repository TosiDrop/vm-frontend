import axios from "axios";
import { Dto } from "src/entities/dto";

export async function getRewards(
  address: string
): Promise<Dto.GetRewards["response"] | undefined> {
  const response = await axios.get(`/api/getrewards?address=${address}`);
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
): Promise<Dto.GetCustomRewards["response"] | undefined> {
  const response = await axios.get(
    `/api/getcustomrewards?staking_address=${staking_address}&session_id=${session_id}&selected=${selected}&unlock=${
      unlock ? "true" : "false"
    }`
  );
  if (response && response.data) {
    return response.data;
  }
  return undefined;
}

export async function getDeliveredRewards(
  stakingAddress: string
): Promise<Dto.GetDeliveredRewards["response"]> {
  const response = await axios.get(
    `/api/getdeliveredrewards?staking_address=${stakingAddress}`
  );
  return response.data;
}

export async function getTxStatus(
  request_id: string,
  session_id: string
): Promise<Dto.GetTxStatus["response"]> {
  const response = await axios.get(
    `/api/txstatus?request_id=${request_id}&session_id=${session_id}`
  );
  return response.data;
}

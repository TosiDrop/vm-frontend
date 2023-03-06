import axios from "axios";
import { NetworkId } from "src/entities/common.entities";
import { Dto } from "src/entities/dto";

export async function getFeatures(): Promise<Dto.GetFeatures["response"]> {
  const response = await axios.get(`/features`);
  return response.data;
}

export async function getSettings(): Promise<Dto.GetSettings["response"]> {
  const response = await axios.get(`/api/getsettings`);
  return response.data;
}

export async function getStakeKey(
  addr: string
): Promise<Dto.GetStakeKey["response"]> {
  if (addr.slice(0, 5) === "stake") {
    return { staking_address: addr };
  }
  const response = await axios.get(`/api/getstakekey?address=${addr}`);
  return response.data;
}

export async function getEpochParams(): Promise<
  Dto.GetEpochParams["response"]
> {
  const response = await axios.get<Dto.GetEpochParams["response"]>(
    `/api/getepochparams`
  );
  return response.data;
}

export async function getNetworkId(): Promise<{ network: NetworkId }> {
  const response = await axios.get<Dto.GetFeatures["response"]>(`/features`);
  if (response && response.data) {
    if (response.data.network === "preview") {
      return { network: NetworkId.preview };
    }
    return { network: NetworkId.mainnet };
  }
  return { network: NetworkId.undefined };
}

export async function getProjects(): Promise<Dto.GetProjects["response"]> {
  const response = await axios.get(`/api/getprojects`);
  return response.data;
}

export async function getPopUpInfo(): Promise<Dto.GetPopUpInfo["response"]> {
  const response = await axios.get(`/api/getpopupinfo`);
  return response.data;
}

export async function getPools(): Promise<Dto.GetPools["response"]> {
  const response = await axios.get(`/api/getpools`);
  return response.data;
}

export async function getTip(): Promise<Dto.GetTip["response"]> {
  const response = await axios.get(`/api/gettip`);
  return response.data;
}

export async function getQueue(): Promise<Dto.GetQueue["response"]> {
  const response = await axios.get(`/api/getqueue`);
  return response.data;
}

export async function getTokens(): Promise<Dto.GetTokens["response"]> {
  const response = await axios.get(`/api/gettokens`);
  return response.data;
}

export async function createStakeTx(
  params: Dto.CreateStakeTx["query"]
): Promise<Dto.CreateStakeTx["response"]> {
  const response = await axios.get<Dto.CreateStakeTx["response"]>(
    `/api/tx/stake?poolId=${params.poolId}&address=${params.address}`
  );
  return response.data;
}

export async function submitStakeTx(
  params: Dto.SubmitTx["body"]
): Promise<Dto.SubmitTx["response"]> {
  const response = await axios.post<Dto.SubmitTx["response"]>(
    `/api/tx/stake`,
    params
  );
  return response.data;
}

import axios from "axios";
import { NetworkId, PopUpInfo } from "src/entities/common.entities";
import {
  GetEpochParamsDto,
  GetPoolsDto,
  GetQueueDto,
  StakeTxDto,
} from "src/entities/dto";
import { EpochParams, Tip } from "src/entities/koios.entities";
import { ProjectData } from "src/entities/project.entities";
import { GetTokens } from "src/entities/vm.entities";

export async function getFeatures() {
  const response = await axios.get(`/features`);
  return response.data;
}

export async function getSettings() {
  const response = await axios.get(`/api/getsettings`);
  return response.data;
}

export async function getStakeKey(addr: string) {
  if (addr.slice(0, 5) === "stake") {
    return { staking_address: addr };
  }
  const response = await axios.get(`/api/getstakekey?address=${addr}`);
  return response.data;
}

export async function getEpochParams(): Promise<EpochParams> {
  const response = await axios.get<GetEpochParamsDto>(`/api/getepochparams`);
  return response.data;
}

export async function getNetworkId(): Promise<{ network: NetworkId }> {
  const response = await axios.get(`/features`);
  if (response && response.data) {
    if (response.data.network === "preview") {
      return { network: NetworkId.preview };
    }
    return { network: NetworkId.mainnet };
  }
  return { network: NetworkId.undefined };
}

export async function getProjects(): Promise<ProjectData[]> {
  const response = await axios.get(`/api/getprojects`);
  return response.data;
}

export async function getPopUpInfo(): Promise<PopUpInfo> {
  const response = await axios.get(`/api/getpopupinfo`);
  return response.data;
}

export async function getPools(): Promise<GetPoolsDto> {
  const response = await axios.get(`/api/getpools`);
  return response.data;
}

export async function getTip(): Promise<Tip> {
  const response = await axios.get(`/api/gettip`);
  return response.data;
}

export async function getQueue(): Promise<GetQueueDto> {
  const response = await axios.get(`/api/getqueue`);
  return response.data;
}

export async function getTokens(): Promise<GetTokens> {
  const response = await axios.get(`/api/gettokens`);
  return response.data;
}

export async function createStakeTx(
  params: StakeTxDto.GetTxRequest
): Promise<StakeTxDto.GetTxResponse> {
  const response = await axios.get<StakeTxDto.GetTxResponse>(
    `/api/tx/stake?poolId=${params.poolId}&address=${params.address}`
  );
  return response.data;
}

export async function submitStakeTx(
  params: StakeTxDto.PostSignedTxRequest
): Promise<StakeTxDto.PostSignedTxResponse> {
  const response = await axios.post<StakeTxDto.PostSignedTxResponse>(
    `/api/tx/stake`,
    params
  );
  return response.data;
}

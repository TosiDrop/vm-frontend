import axios from "axios";
import { CardanoTypes } from "src/entities/cardano";
import { PopUpInfo } from "src/entities/common.entities";
import { Dto, GetPoolsDto, GetQueueDto } from "src/entities/dto";
import { EpochParams, Tip } from "src/entities/koios.entities";
import { ProjectData } from "src/entities/project.entities";
import { GetTokens } from "src/entities/vm.entities";

export async function getFeatures() {
  const response = await axios.get(`/features`);
  return response.data;
}

export async function getSettings(): Promise<Dto.GetVmSettings["response"]> {
  const response = await axios.get<Dto.GetVmSettings["response"]>(
    `/api/getsettings`
  );
  return response.data;
}

export async function getStakeKey(addr: string) {
  if (addr.slice(0, 5) === "stake") {
    return { staking_address: addr };
  }
  const response = await axios.get(`/api/getstakekey?address=${addr}`);
  return response.data;
}

export async function getBlock(): Promise<{ block_no: number }> {
  const response = await axios.get(`/api/getblock`);
  if (response && response.data) {
    return response.data;
  }
  return { block_no: 0 };
}

export async function getEpochParams(): Promise<EpochParams> {
  const response = await axios.get(`/api/getepochparams`);
  return response.data[0];
}

export async function getNetworkId(): Promise<CardanoTypes.NetworkId> {
  const response = await axios.get(`/features`);
  if (response && response.data) {
    if (response.data.network === "preview") {
      return CardanoTypes.NetworkId.preview;
    }
    return CardanoTypes.NetworkId.mainnet;
  }
  return CardanoTypes.NetworkId.undefined;
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
  params: Dto.CreateDelegationTx["body"]
): Promise<Dto.CreateDelegationTx["response"]> {
  const response = await axios.post<Dto.CreateDelegationTx["response"]>(
    `/api/tx/delegate`,
    params
  );
  return response.data;
}

export async function createTransferTx(
  params: Dto.CreateTransferTx["body"]
): Promise<Dto.CreateTransferTx["response"]> {
  const response = await axios.post<Dto.CreateTransferTx["response"]>(
    `/api/tx/transfer`,
    params
  );
  return response.data;
}

export async function submitStakeTx(
  params: Dto.SubmitTx["body"]
): Promise<Dto.SubmitTx["response"]> {
  const response = await axios.post<Dto.SubmitTx["response"]>(
    `/api/tx/submit`,
    params
  );
  return response.data;
}

export async function getBech32Address({
  addressInHex,
}: Dto.GetBech32Address["query"]): Promise<
  Dto.GetBech32Address["response"]["addressInBech32"]
> {
  const response = await axios.get<Dto.GetBech32Address["response"]>(
    `/api/util/bech32-address?addressInHex=${addressInHex}`
  );
  return response.data.addressInBech32;
}

export async function getBannerText(): Promise<
  Dto.GetBannerText["response"]["text"]
> {
  const response = await axios.get<Dto.GetBannerText["response"]>(
    `/api/admin/banner`
  );
  return response.data.text;
}

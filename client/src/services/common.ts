import axios from "axios";
import { NetworkId, PopUpInfo } from "src/entities/common.entities";
import { EpochParams } from "src/entities/koios.entities";
import { ProjectData } from "src/entities/project.entities";

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

export async function getBlock(): Promise<{ block_no: number }> {
  const response = await axios.get(`/api/getblock`);
  if (response && response.data) {
    return response.data;
  }
  return { block_no: 0 };
}

export async function getEpochParams(): Promise<EpochParams[]> {
  const response = await axios.get(`/api/getepochparams`);
  return response.data[0];
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

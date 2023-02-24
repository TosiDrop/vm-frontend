import axios from "axios";
import { VM_KOIOS_URL } from "..";
import { KoiosTypes } from "../types/koios";
import { createErrorWithCode, HttpStatusCode } from "../utils/error";

export namespace KoiosService {
  export async function getAccountInformation(
    stakeAddress: string
  ): Promise<KoiosTypes.AccountInfo> {
    const action = "account_info";
    const params = {
      _stake_addresses: [stakeAddress],
    };
    const response = await postFromKoios<KoiosTypes.AccountInfo[]>(
      action,
      params
    );
    if (response.length === 0) {
      throw createErrorWithCode(
        HttpStatusCode.BAD_REQUEST,
        "Fail to get account information"
      );
    }
    return response[0];
  }

  export async function getProtocolParameters(): Promise<KoiosTypes.EpochProtocolParameters> {
    const tip = await getBlockchainTip();
    const currentEpoch = tip.epoch_no;
    const parameters = await getFromKoios<KoiosTypes.EpochProtocolParameters[]>(
      "epoch_params",
      `_epoch_no=${currentEpoch}`
    );
    return parameters[0];
  }

  export async function getBlockchainTip(): Promise<KoiosTypes.BlockchainTip> {
    const tips = await getFromKoios<KoiosTypes.BlockchainTip[]>("tip");
    if (tips.length === 0) {
      throw createErrorWithCode(HttpStatusCode.BAD_REQUEST, "Fail to get tip");
    }
    return tips[0];
  }

  export async function getAddressesFromStakeAddress(
    stakeAddress: string
  ): Promise<string[]> {
    const response = await postFromKoios<
      { stake_address: string; addresses: string[] }[]
    >("account_addresses", { _stake_addresses: [stakeAddress] });
    if (response.length === 0) {
      throw createErrorWithCode(
        HttpStatusCode.BAD_REQUEST,
        "Fail to get addresses"
      );
    }
    return response[0].addresses;
  }

  export async function getAddressesInformation(
    addresses: string[]
  ): Promise<KoiosTypes.AddressInformation[]> {
    const response = await postFromKoios<KoiosTypes.AddressInformation[]>(
      "address_info",
      { _addresses: [addresses] }
    );
    if (response.length === 0) {
      throw createErrorWithCode(
        HttpStatusCode.BAD_REQUEST,
        "Fail to get address information"
      );
    }
    return response;
  }

  async function getFromKoios<T>(action: string, params?: any): Promise<T> {
    return (
      await axios.get<T>(
        `${VM_KOIOS_URL}/${action}${params ? "?" + params : ""}`
      )
    ).data;
  }

  async function postFromKoios<T>(action: string, params?: any): Promise<T> {
    return (await axios.post<T>(`${VM_KOIOS_URL}/${action}`, params)).data;
  }
}

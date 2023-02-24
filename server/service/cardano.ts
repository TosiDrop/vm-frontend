import {
  Address,
  BaseAddress,
  RewardAddress,
} from "@emurgo/cardano-serialization-lib-nodejs";
import { CARDANO_NETWORK } from "..";
import { createErrorWithCode, HttpStatusCode } from "../utils/error";
import { CardanoNetwork } from "../utils/interfaces";

export namespace CardanoService {
  export function getStakeAddress(address: string): string {
    let rewardAddressBytes = new Uint8Array(29);
    switch (CARDANO_NETWORK) {
      case CardanoNetwork.mainnet:
        rewardAddressBytes.set([0xe1], 0);
        break;
      case CardanoNetwork.preview:
      default:
        rewardAddressBytes.set([0xe0], 0);
        break;
    }

    const addressObject = Address.from_bech32(address);
    const baseAddress = BaseAddress.from_address(addressObject);
    if (baseAddress == null) {
      throw createErrorWithCode(
        HttpStatusCode.BAD_REQUEST,
        "Address id invalid. Failed to derive stake address"
      );
    }
    rewardAddressBytes.set(baseAddress.stake_cred().to_bytes().slice(4, 32), 1);

    let rewardAddress = RewardAddress.from_address(
      Address.from_bytes(rewardAddressBytes)
    );

    if (rewardAddress == null) {
      throw createErrorWithCode(
        HttpStatusCode.BAD_REQUEST,
        "Address id invalid. Failed to derive stake address"
      );
    }

    return rewardAddress.to_address().to_bech32();
  }

  export function getStakeCredHash(addressInBech32: string) {
    const address = Address.from_bech32(addressInBech32);
    const baseAddress = BaseAddress.from_address(address);

    if (baseAddress?.stake_cred().kind() !== 0) {
      throw createErrorWithCode(
        HttpStatusCode.BAD_REQUEST,
        "Address is invalid"
      );
    }

    const buffer = Buffer.from(
      baseAddress.stake_cred().to_keyhash()!.to_bytes()
    );
    return buffer.toString("hex");
  }
}

import {
  Address,
  AssetName,
  Assets,
  BaseAddress,
  BigNum,
  MultiAsset,
  RewardAddress,
  ScriptHash,
  TransactionHash,
  TransactionInput,
  TransactionOutput,
  TransactionUnspentOutput,
  Value,
} from "@emurgo/cardano-serialization-lib-nodejs";
import { CARDANO_NETWORK } from "..";
import { KoiosTypes } from "../types/koios";
import { convertHexToBuffer } from "../utils";
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

  export function convertAssetsToValue(utxo: KoiosTypes.UTxO): Value {
    const multiAsset = MultiAsset.new();
    const assetsGroupedByPolicyId: Record<string, KoiosTypes.NativeToken[]> =
      {};
    utxo.asset_list.forEach((asset) => {
      const key = asset.policy_id;
      if (assetsGroupedByPolicyId[key]) {
        assetsGroupedByPolicyId[key].push(asset);
      } else {
        assetsGroupedByPolicyId[key] = [asset];
      }
    });
    Object.keys(assetsGroupedByPolicyId).forEach((policyId) => {
      const assets = Assets.new();
      assetsGroupedByPolicyId[policyId].forEach((asset) => {
        assets.insert(
          AssetName.new(convertHexToBuffer(asset.asset_name)),
          BigNum.from_str(asset.quantity)
        );
      });
      multiAsset.insert(
        ScriptHash.from_bytes(convertHexToBuffer(policyId)),
        assets
      );
    });
    const value = Value.new(BigNum.from_str(utxo.value));
    if (utxo.asset_list.length > 0) {
      value.set_multiasset(multiAsset);
    }
    return value;
  }

  export function createUtxo(
    utxo: KoiosTypes.UTxO,
    address: string
  ): TransactionUnspentOutput {
    const utxoValue = CardanoService.convertAssetsToValue(utxo);
    const input = TransactionInput.new(
      TransactionHash.from_hex(utxo.tx_hash),
      Number(utxo.tx_index)
    );
    const output = TransactionOutput.new(
      Address.from_bech32(address),
      utxoValue
    );
    return TransactionUnspentOutput.new(input, output);
  }
}

import {
    Address,
    BaseAddress,
    RewardAddress,
} from "@emurgo/cardano-serialization-lib-asmjs";
import axios from "axios";
import { NetworkId } from "src/entities/common.entities";
let Buffer = require("buffer").Buffer;

export const getStakeKey = async (
    searchAddress: string,
    networkId: number | undefined
): Promise<string | null> => {
    if (networkId == null) return null;

    const prefix = searchAddress.slice(0, 5);
    let rewardAddressBytes = new Uint8Array(29);

    switch (true) {
        /**
         * check if testnet address
         */
        case prefix === "addr_" && networkId === NetworkId.testnet:
            rewardAddressBytes.set([0xe0], 0);
            break;
        /**
         * check if mainnet address
         */
        case prefix === "addr1" && networkId === NetworkId.mainnet:
            rewardAddressBytes.set([0xe1], 0);
            break;
        /**
         * check if ada handle on testnet
         */
        case prefix[0] === "$" && networkId === NetworkId.testnet:
            searchAddress = await translateAdaHandle(searchAddress, networkId);
            rewardAddressBytes.set([0xe0], 0);
            break;
        /**
         * check if ada handle on mainnet
         */
        case prefix[0] === "$" && networkId === NetworkId.mainnet:
            searchAddress = await translateAdaHandle(searchAddress, networkId);
            rewardAddressBytes.set([0xe1], 0);
            break;
        /**
         * check if not receive address
         */
        default:
            return searchAddress;
    }

    const addressObject = Address.from_bech32(searchAddress);
    const baseAddress = BaseAddress.from_address(addressObject);
    if (baseAddress == null) return null;
    rewardAddressBytes.set(baseAddress.stake_cred().to_bytes().slice(4, 32), 1);

    let rewardAddress = RewardAddress.from_address(
        Address.from_bytes(rewardAddressBytes)
    );

    if (rewardAddress == null) return null;

    return rewardAddress.to_address().to_bech32();
};

const translateAdaHandle = async (handle: string, networkId: NetworkId) => {
    let urlPrefix = "";
    let policyId = "";
    switch (networkId) {
        case NetworkId.mainnet:
            urlPrefix = "api";
            policyId =
                "f0ff48bbb7bbe9d59a40f1ce90e9e9d0ff5002ec48f232b49ca0fb9a";
            break;
        case NetworkId.testnet:
        default:
            urlPrefix = "testnet";
            policyId =
                "8d18d786e92776c824607fd8e193ec535c79dc61ea2405ddf3b09fe3";
    }

    handle = handle.slice(1); // remove $
    if (!handle.length) return null; // check if handle is $
    const handleInHex = Buffer.from(handle).toString("hex");
    const url = `https://${urlPrefix}.koios.rest/api/v0/asset_address_list?_asset_policy=${policyId}&_asset_name=${handleInHex}`;
    const data = (await axios.get(url)).data;
    if (!data.length) return null;
    const address = data[0].payment_address;
    return address;
};

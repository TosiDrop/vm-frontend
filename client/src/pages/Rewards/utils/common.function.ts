import {
    Address,
    BaseAddress,
    RewardAddress,
} from "@emurgo/cardano-serialization-lib-asmjs";

export const getStakeKey = (searchAddress: string): string | null => {
    const prefix = searchAddress.slice(0, 5);
    const addressObject = Address.from_bech32(searchAddress);
    const baseAddress = BaseAddress.from_address(addressObject);
    let rewardAddressBytes = new Uint8Array(29);

    switch (true) {
        /**
         * check if testnet address
         */
        case prefix === "addr_":
            rewardAddressBytes.set([0xe0], 0);
            break;
        /**
         * check if mainnet address
         */
        case prefix === "addr1":
            rewardAddressBytes.set([0xe1], 0);
            break;
        /**
         * check if not receive address
         */
        default:
            return searchAddress;
    }

    if (baseAddress == null) return null;
    rewardAddressBytes.set(baseAddress.stake_cred().to_bytes().slice(4, 32), 1);

    let rewardAddress = RewardAddress.from_address(
        Address.from_bytes(rewardAddressBytes)
    );

    if (rewardAddress == null) return null;

    return rewardAddress.to_address().to_bech32();
};

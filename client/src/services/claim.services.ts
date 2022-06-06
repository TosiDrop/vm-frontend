import { NetworkId } from "src/entities/common.entities";
import { EpochParams, TransactionStatus } from "src/entities/koios.entities";
import { GetRewards, GetCustomRewards } from "../entities/vm.entities";
import axios from "axios";

export async function getRewards(
    address: string
): Promise<GetRewards | undefined> {
    const response = await axios.get(`/getrewards?address=${address}`);
    if (response && response.data) {
        return response.data;
    }
    return undefined;
}

export async function getCustomRewards(
    staking_address: string,
    session_id: string,
    selected: string
): Promise<GetCustomRewards | undefined> {
    const response = await axios.get(
        `/getcustomrewards?staking_address=${staking_address}&session_id=${session_id}&selected=${selected}`
    );
    if (response && response.data) {
        return response.data;
    }
    return undefined;
}

export async function getTransactionStatus(
    txHash: string
): Promise<TransactionStatus[] | undefined> {
    const response = await axios.get(`/gettransactionstatus?txHash=${txHash}`);
    if (response && response.data) {
        return response.data;
    }
    return undefined;
}

export async function getBlock(): Promise<{ block_no: number }> {
    const response = await axios.get(`/getblock`);
    if (response && response.data) {
        return response.data;
    }
    return { block_no: 0 };
}

export async function getEpochParams(): Promise<EpochParams[]> {
    const response = await axios.get(`/getepochparams`);
    return response.data[0];
}

export async function getNetworkId(): Promise<{ network: NetworkId }> {
    const response = await axios.get(`/features`);
    if (response && response.data) {
        if (response.data.network === "testnet") {
            return { network: NetworkId.testnet };
        }
        return { network: NetworkId.mainnet };
    }
    return { network: NetworkId.undefined };
}

export async function getTxStatus(request_id: string, session_id: string) {
    const response = await axios.get(
        `/txstatus?request_id=${request_id}&session_id=${session_id}`
    );
    return response.data;
}

export async function getSettings() {
    const response = await axios.get(`/getsettings`);
    return response.data;
}

export async function getStakeKey(addr: string) {
    if (addr.slice(0, 5) === "stake") {
        return { staking_address: addr };
    }
    const response = await axios.get(`/getstakekey?address=${addr}`);
    return response.data;
}

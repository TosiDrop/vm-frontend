import { NetworkId, PaymentTransactionHashRequest, TokenTransactionHashRequest } from "src/entities/common.entities";
import { TransactionStatus } from "src/entities/koios.entities";
import { GetRewards } from "../entities/vm.entities";
const axios = require('axios').default;

export async function getRewards(address: string): Promise<GetRewards | undefined> {
    const response = await axios.get(`/getrewards?address=${address}`);
    if (response && response.data) {
        return response.data;
    }
    return undefined;
}

export async function getTransactionStatus(txHash: string): Promise<TransactionStatus[] | undefined> {
    const response = await axios.get(`/gettransactionstatus?txHash=${txHash}`);
    if (response && response.data) {
        return response.data;
    }
    return undefined;
}

export async function getPaymentTransactionHash(paymentTransactionHashRequest: PaymentTransactionHashRequest): Promise<{ txHash: string } | undefined> {
    const response = await axios.post(`/getpaymenttransactionhash`, paymentTransactionHashRequest);
    if (response && response.data) {
        return response.data;
    }
    return undefined;
}

export async function getTokenTransactionHash(tokenTxHashRequest: TokenTransactionHashRequest): Promise<{ txHash: string } | undefined> {
    const response = await axios.post(`/gettokentransactionhash`, tokenTxHashRequest);
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

export async function getNetworkId(): Promise<{ network: NetworkId }> {
    const response = await axios.get(`/network`);
    if (response && response.data) {
        return response.data;
    }
    return { network: NetworkId.undefined };
}
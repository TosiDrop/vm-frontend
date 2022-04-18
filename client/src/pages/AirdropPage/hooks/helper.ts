import {
    PolicyIDAndAssetNameToAmountMap,
    Token,
    AssetDetailFromAPI,
    PolicyIDAndAssetNameToAdaAddressMap,
    AIRDROP_API_REG,
    AIRDROP_API_TX,
} from "../utils";
import { TransactionUnspentOutput } from "@emurgo/cardano-serialization-lib-asmjs";
import axios from "axios";
let Buffer = require("buffer").Buffer;

export const parseUtxo = (rawUtxo: string) => {
    const utxo = TransactionUnspentOutput.from_bytes(
        Buffer.from(rawUtxo, "hex")
    );
    const output = utxo.output();
    /**
     * Ada amount in lovelace
     */
    const address = output.address().to_bech32();
    const amount = Number(output.amount().coin().to_str());
    const multiasset = output.amount().multiasset();
    return {
        amount,
        multiasset,
        address,
    };
};

export const getAssetDetails = async (
    assetAmount: PolicyIDAndAssetNameToAmountMap
) => {
    const url = AIRDROP_API_REG + "/api/v0/tokens";
    if (!url) return [];
    const tokens: { policy_id: string; token_name: string }[] = [];
    try {
        for (let policyId in assetAmount) {
            for (let assetName in assetAmount[policyId]) {
                tokens.push({
                    policy_id: policyId,
                    token_name: assetName,
                });
            }
        }
        /**
         * This means that the wallet has no asset other than ada
         */
        if (!tokens.length) return [];
        const res = await axios.post(url, { tokens });
        return res.data;
    } catch (e: any) {
        switch (e.response.status) {
            case 406:
                const defaultTokenDetails = [];
                for (let token of tokens) {
                    defaultTokenDetails.push({
                        decimals: 0,
                        ticker: Buffer.from(token.token_name, "hex").toString(),
                        policy_id: token.policy_id,
                        name_hex: token.token_name,
                    });
                }
                return defaultTokenDetails;
            default:
                return [];
        }
    }
};

export const getCompleteTokenArray = (
    assetAmount: PolicyIDAndAssetNameToAmountMap,
    assetAddresses: PolicyIDAndAssetNameToAdaAddressMap,
    assetDetail: AssetDetailFromAPI[]
) => {
    const tokens: Token[] = [];
    for (let token of assetDetail) {
        const { ticker, policy_id, decimals, name_hex } = token;
        tokens.push({
            name: ticker,
            amount: assetAmount[policy_id][name_hex],
            decimals: decimals,
            ticker: ticker,
            policyId: policy_id,
            nameHex: name_hex,
            addressContainingToken: assetAddresses[policy_id][name_hex],
        });
    }
    return tokens;
};

export const convertBufferToHex = (inBuffer: Uint8Array): string => {
    const inString = Buffer.from(inBuffer, "utf8").toString("hex");
    return inString;
};

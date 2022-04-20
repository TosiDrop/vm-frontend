import {
    PolicyIDAndAssetNameToAmountMap,
    Token,
    AssetDetailFromAPI,
    PolicyIDAndAssetNameToAdaAddressMap,
    AIRDROP_API_REG,
    AIRDROP_API_TX,
    AdaAddress,
    AirdropRequestBody,
    TransactionInfo,
    TokenAddress,
    convertBufferToHex,
} from "../utils";
import {
    Transaction,
    TransactionWitnessSet,
    TransactionUnspentOutput,
} from "@emurgo/cardano-serialization-lib-asmjs";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import axios from "axios";

let Buffer = require("buffer").Buffer;

export const transact = async (api: any, cborHex: string, txId: string) => {
    const clearedTx = await clearSignature(cborHex);
    const signedTx = await walletSign(api, clearedTx[0], clearedTx[1], txId);
    const submittedTx = await submitTransaction(signedTx);
    return submittedTx;
};

// get the airdrop transactions
export const getAirdrop = async (airdropHash: any) => {
    const response = await axios.get(
        `${AIRDROP_API_TX}/api/v0/get_transactions/${airdropHash}`
    );
    const transactions = response.data;
    const transactionsToSign: TransactionInfo[] = [];
    const txHashMap: { [key: string]: boolean } = {};
    let txDesc: string;
    for (let tx of transactions) {
        txDesc = tx.description;
        if (txHashMap[txDesc] == null) {
            txHashMap[txDesc] = true;
            transactionsToSign.push({ ...tx });
        }
    }
    return transactionsToSign;
};

export const submitTransaction = async (txJson: any) => {
    try {
        const txSubmit = await axios.post(
            `${AIRDROP_API_TX}/api/v0/submit_transaction`,
            txJson
        );
        const submission = txSubmit.data;
        return submission;
    } catch (e) {
        console.error(e);
    }
};

//signing funcion and creating json object

export const walletSign = async (
    api: any,
    tx: any,
    transactionWitnessSet: any,
    txId: any
) => {
    let txVkeyWitnesses = await api.signTx(
        Buffer.from(tx.to_bytes(), "utf8").toString("hex"),
        true
    );
    txVkeyWitnesses = TransactionWitnessSet.from_bytes(
        Buffer.from(txVkeyWitnesses, "hex")
    );
    transactionWitnessSet.set_vkeys(txVkeyWitnesses.vkeys());
    const signedTx = Transaction.new(tx.body(), transactionWitnessSet);
    const hexSigned = await Buffer.from(signedTx.to_bytes(), "utf8").toString(
        "hex"
    );
    const txFormatted = `{ \n\t\"type\": \"Tx AlonzoEra\",\n\t\"description\": \"${txId}",\n\t\"cborHex\": \"${hexSigned}\"\n}`;
    const txJson = JSON.parse(txFormatted);
    return txJson;
};

// code to wipe the transaction witnesses. This is required to prepare
/// cardano-cli tx for cardano-serialization-lib signing.
export const clearSignature = async (cborHex: any) => {
    const txCli = Transaction.from_bytes(Buffer.from(cborHex, "hex"));
    //begin signature
    const txBody = txCli.body();
    const witnessSet = txCli.witness_set();
    //this clears the dummy signature from the transaction
    witnessSet.vkeys()?.free();
    //build new unsigned transaction
    var transactionWitnessSet = TransactionWitnessSet.new();
    var tx = Transaction.new(
        txBody,
        TransactionWitnessSet.from_bytes(transactionWitnessSet.to_bytes())
    );
    return [tx, transactionWitnessSet];
};

export const prepareBody = (
    selectedToken: Token,
    addressArray: TokenAddress[],
    addressContainingAda: AdaAddress[]
) => {
    const sourceAddresses = addressContainingAda.map((addr) => addr.address);

    const body: AirdropRequestBody = {
        source_addresses: sourceAddresses,
        token_name: `${selectedToken.policyId}.${selectedToken.nameHex}`,
        addresses: addressArray.map((addr: TokenAddress) => ({
            [addr.address]:
                addr.tokenAmount * Math.pow(10, selectedToken.decimals),
        })),
    };
    return body;
};

export const checkTxStatus = async (airdropHash: any) => {
    const response = await axios.get(
        `${AIRDROP_API_TX}/api/v0/airdrop_status/${airdropHash}`
    );
    const txStatus = response.data.transactions[0].transaction_status;
    if (txStatus == "transaction adopted") return true;
    return false;
};

export const getTokenArrayInWallet = async (API: any): Promise<Token[]> => {
    try {
        /**
         * Only fetch usable UTXOs
         * check another function to get the collateral
         */
        const assetAmount: PolicyIDAndAssetNameToAmountMap = {};
        const assetAddresses: PolicyIDAndAssetNameToAdaAddressMap = {};
        const rawUtxos: string[] = await API.getUtxos();
        const parsedUtxos = rawUtxos.map((rawUtxo) => parseUtxo(rawUtxo));
        const addressContainingAda: AdaAddress[] = [];
        let addressAmountObj: TokenAddress;

        for (const parsedUtxo of parsedUtxos) {
            const { multiasset, address, amount } = parsedUtxo;
            addressContainingAda.push({ address, adaAmount: amount });

            /**
             * if utxo contains asset other than ada
             * check them
             */
            if (!multiasset) continue;

            const keys = multiasset.keys();
            const numberOfAssetType = keys.len();

            for (let i = 0; i < numberOfAssetType; i++) {
                const policyId = keys.get(i);
                const assets = multiasset.get(policyId);

                if (assets == null) continue;

                const assetNames = assets.keys();
                const K = assetNames.len();

                const policyIdString = convertBufferToHex(policyId.to_bytes());

                if (!assetAmount[policyIdString]) {
                    assetAmount[policyIdString] = {};
                }

                if (!assetAddresses[policyIdString]) {
                    assetAddresses[policyIdString] = {};
                }

                for (let j = 0; j < K; j++) {
                    const assetName = assetNames.get(j);
                    const assetNameHex = Buffer.from(
                        (assetName as any).name(),
                        "utf8"
                    ).toString("hex");
                    const multiassetAmt = multiasset.get_asset(
                        policyId,
                        assetName
                    );
                    const assetAmountInUtxo = Number(multiassetAmt.to_str());

                    if (!assetAmount[policyIdString][assetNameHex]) {
                        assetAmount[policyIdString][assetNameHex] = 0;
                    }
                    assetAmount[policyIdString][assetNameHex] +=
                        assetAmountInUtxo;

                    addressAmountObj = {
                        address,
                        tokenAmount: assetAmountInUtxo,
                        adaAmount: amount,
                    };

                    if (!assetAddresses[policyIdString][assetNameHex]) {
                        assetAddresses[policyIdString][assetNameHex] = [];
                    }
                    assetAddresses[policyIdString][assetNameHex].push(
                        addressAmountObj
                    );
                }
            }
        }

        const assetDetail = await getAssetDetails(assetAmount);
        const tokenArray = getCompleteTokenArray(
            assetAmount,
            assetAddresses,
            assetDetail
        );
        tokenArray.sort((a, b) => (a.name < b.name ? -1 : 1));
        return tokenArray;
    } catch (err) {
        return [];
    }
};

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
): Token[] => {
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

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
    lovelaceToAda,
} from ".";
import {
    Transaction,
    TransactionWitnessSet,
    TransactionUnspentOutput,
} from "@emurgo/cardano-serialization-lib-asmjs";
import { AirdropRequest } from "./interfaces";
import { CIP0030API } from "src/services/connectors/wallet.connector";
import { ERROR } from "./constants";
import {
    getAirdropTxs,
    submitTxRequest,
    submitSignedTx,
    getTokenDetails,
    validateAirdrop,
} from "src/services/airdrop.services";

let Buffer = require("buffer").Buffer;

export const transact = async (api: any, cborHex: string, txId: string) => {
    const clearedTx = await clearSignature(cborHex);
    const signedTx = await walletSign(api, clearedTx[0], clearedTx[1], txId);
    const submittedTx = await submitSignedTx(signedTx);
    return submittedTx;
};

// get the airdrop transactions
export const getAirdrop = async (airdropHash: any) => {
    const response = await getAirdropTxs(airdropHash);
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
    const txFormatted = `{ \n\t"type": "Tx AlonzoEra",\n\t"description": "${txId}",\n\t"cborHex": "${hexSigned}"\n}`;
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

export const getTokenArrayInWallet = async (
    API: any
): Promise<{ tokens: Token[]; adaAddresses: AdaAddress[] }> => {
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
        return {
            tokens: tokenArray,
            adaAddresses: addressContainingAda,
        };
    } catch (err) {
        return { tokens: [], adaAddresses: [] };
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
        const tokenDetails = await getTokenDetails(tokens);
        return tokenDetails;
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

export const validateAirdropRequest = async (
    selectedToken: Token,
    addressArray: TokenAddress[],
    addressContainingAda: AdaAddress[]
): Promise<AirdropRequest> => {
    const requestBody = prepareBody(
        selectedToken,
        addressArray,
        addressContainingAda
    );

    try {
        const txData = await validateAirdrop(requestBody);
        const adaToSpendForTxInAda = lovelaceToAda(
            txData.data.spend_amounts.lovelace
        );
        const txFeeInAda = lovelaceToAda(txData.data.tx_fee);
        let multiTx = false;
        if (txData.data.transactions_count > 1) {
            multiTx = true;
        }

        return {
            valid: true,
            detail: {
                txFee: txFeeInAda,
                adaToSpend: adaToSpendForTxInAda,
                multiTx,
            },
        } as AirdropRequest;
    } catch (e: any) {
        return {
            valid: false,
            errorMessage: getAirdropErrorMsg(
                e.response.data.CODE,
                addressArray.length * 1.5
            ),
        } as AirdropRequest;
    }
};

const getAirdropErrorMsg = (code: string, additionalInfo?: any) => {
    switch (code) {
        case ERROR.NOT_ENOUGH_ADA:
            return `You don't have enough ADA in your wallet to execute this airdrop. Please prepare at least ${additionalInfo} ADA (1.5 ADA times the number of address) to execute the airdrop.`;
        default:
            return "Something is wrong :(";
    }
};

export const execAirdrop = async (
    api: CIP0030API,
    selectedToken: Token,
    addressArray: TokenAddress[],
    addressContainingAda: AdaAddress[]
) => {
    // setPopUpLoading(`Sending ${totalAmountToAirdrop} ${selectedToken.name}...`);

    const requestBody = prepareBody(
        selectedToken,
        addressArray,
        addressContainingAda
    );

    /**
     * Submit first transaction after validation.
     * first transaction is done to get the airdrop txs.
     */
    const airdropTxData = await submitTxRequest(requestBody);
    const cborHexInString = airdropTxData.data.cborHex;

    /**
     * the API uses the transaction id as a unique identifier.
     * cardano serialization lib modifies it. We us the description
     * field of the transaction json to pass along the original value.
     */
    const txId = airdropTxData.data.description;

    /**
     * functions to  erase witnesses, sign, and submit to api
     */
    const firstAirdropTx = await transact(api, cborHexInString, txId);
    return firstAirdropTx.airdrop_hash;
};

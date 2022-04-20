import {
    TokenAddress,
    Token,
    AdaAddress,
    AIRDROP_API_TX,
    prepareBody,
    lovelaceToAda,
    transact,
    checkTxStatus,
    sleep,
    getAirdrop,
} from "../utils";
import axios from "axios";

const useAirdrop = () => {
    const validateAirdropRequest = async (
        selectedToken: Token,
        addressArray: TokenAddress[],
        addressContainingAda: AdaAddress[]
    ) => {
        // setPopUpLoading("Validating request...");

        const requestBody = prepareBody(
            selectedToken,
            addressArray,
            addressContainingAda
        );

        try {
            const txData = await axios.post(
                `${AIRDROP_API_TX}/api/v0/validate`,
                requestBody
            );
            const adaToSpendForTxInAda = lovelaceToAda(
                txData.data.spend_amounts.lovelace
            );
            const txFeeInAda = lovelaceToAda(txData.data.tx_fee);
            // setTxFee(txFeeInAda);
            // setAdaToSpend(adaToSpendForTxInAda);
            // setTsAbleToAirdrop(true);
            if (txData.data.transactions_count > 1) {
                // setMultiTx(true);
            } else {
                // setMultiTx(false);
            }

            // setPopUpSuccess(
            //   `Airdrop is validated. You can proceed with the airdrop.`
            // );
        } catch (e: any) {
            switch (e.response?.status) {
                case 406: {
                    // setPopUpError("Balance in wallet is not enough");
                    return;
                }
            }
        }
    };

    const execAirdrop = async (
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
        try {
            const airdropTxData = await axios.post(
                `${AIRDROP_API_TX}/api/v0/submit`,
                requestBody
            );
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
            const firstAirdropTx = await transact(
                AIRDROP_API_TX,
                cborHexInString,
                txId
            );

            /**
             * check if airdrop is single transaction.
             * if single tx, then airdrop is done in 1 tx
             */
            // if (!multiTx) {
            //   setPopUpSuccess(`Airdrop successful!`);
            // } else {
            //   /**
            //    * else, do multiple signing for multiple airdrop txs
            //    */
            //   setPopUpLoading(`Negotiating UTXOs`);
            //   await handleMultiTxAirdrop(firstAirdropTx.airdrop_hash);
            // }
        } catch (e: any) {}
    };

    const handleMultiTxAirdrop = async (airdropHash: any) => {
        // setPopUpLoading("Splitting your UTxOs...");
        try {
            let firstAirdropTxAdopted: boolean = false;
            while (!firstAirdropTxAdopted) {
                firstAirdropTxAdopted = await checkTxStatus(airdropHash);
                await sleep(500);
            }
            const remainingAirdropTxs = await getAirdrop(airdropHash);
            // setTxToSign(remainingAirdropTxs);
            // setPopUpSuccess(
            //   "Airdrop transactions are created! Please sign the transactions to execute the airdrop"
            // );
            // let cborHex, txId;
            // for (let tx of remainingAirdropTxs) {
            //   cborHex = tx.cborHex;
            //   txId = tx.description;
            //   const firstAirdropTx = await transact(api, cborHex, txId);
            // }
        } catch (e: any) {
            console.error(e);
            // setPopUpError("Something went wrong");
        }
    };
};

export default useAirdrop;

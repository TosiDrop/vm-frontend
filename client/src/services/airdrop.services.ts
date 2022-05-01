import axios from "axios";
import { AIRDROP_API_TX, AIRDROP_API_REG } from "src/pages/Airdrop/utils";

export const submitTxRequest = async (requestBody: any) => {
    const txData = await axios.post(
        `${AIRDROP_API_TX}/api/v0/submit`,
        requestBody
    );
    return txData;
};

export const getAirdropTxs = async (airdropHash: string) => {
    const airdropTxs = await axios.get(
        `${AIRDROP_API_TX}/api/v0/get_transactions/${airdropHash}`
    );
    return airdropTxs;
};

export const submitSignedTx = async (txJson: any) => {
    const txSubmit = await axios.post(
        `${AIRDROP_API_TX}/api/v0/submit_transaction`,
        txJson
    );
    const submission = txSubmit.data;
    return submission;
};

export const getTxStatus = async (airdropHash: string) => {
    const response = await axios.get(
        `${AIRDROP_API_TX}/api/v0/airdrop_status/${airdropHash}`
    );
    const txStatus = response.data.transactions[0].transaction_status;
    if (txStatus === "transaction adopted") return true;
    return false;
};

export const getTokenDetails = async (tokens: any) => {
    const url = `${AIRDROP_API_REG}/api/v0/tokens`;
    const res = await axios.post(url, { tokens });
    return res.data;
};

export const validateAirdrop = async (requestBody: any) => {
    const txData = await axios.post(
        `${AIRDROP_API_TX}/api/v0/validate`,
        requestBody
    );
    return txData;
};

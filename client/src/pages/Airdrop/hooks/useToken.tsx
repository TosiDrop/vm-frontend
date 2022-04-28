import {
    AdaAddress,
    getTokenArrayInWallet,
    Token,
    validateAirdropRequest,
    TokenAddress,
    AirdropRequest,
    AirdropDetail,
    execAirdrop,
    checkTxStatus,
    sleep,
    getAirdrop,
} from "../utils";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/store";
import { showModal } from "src/reducers/modalSlice";
import { ModalTypes } from "src/entities/common.entities";

const useToken = () => {
    const [addressList, setAddressList] = useState<TokenAddress[]>([]);
    const [addresses, setAddresses] = useState<AdaAddress[]>([]);
    const [selectedToken, setSelectedToken] = useState<Token | null>(null);
    const [tokens, setTokens] = useState<Token[]>([]);
    const [validated, setValidated] = useState(false);
    const [airdropDetail, setAirdropDetail] = useState<AirdropDetail>({
        txFee: 0,
        adaToSpend: 0,
        multiTx: false,
    });
    const [totalToken, setTotalToken] = useState(0);
    const [loading, setLoading] = useState(false);
    const [multiTxTransactions, setMultiTxTransactions] = useState<any>([]);

    const api = useSelector((state: RootState) => state.wallet.api);
    const dispatch = useDispatch();

    const handleAddressList = (addressList: TokenAddress[]) => {
        setAddressList(addressList);
        let totalToken = 0;
        addressList.forEach((a) => (totalToken += a.tokenAmount));
        setTotalToken(totalToken);
    };

    useEffect(() => {
        (async () => {
            if (api) {
                const { tokens, adaAddresses } = await getTokenArrayInWallet(
                    api
                );
                setTokens(tokens);
                setAddresses(adaAddresses);
            }
        })();
    }, [api]);

    const exec = async () => {
        if (validated) {
            /**
             * if the transaction is validated,
             * execute airdrop
             */
            if (!selectedToken || api == null) return;
            setLoading(true);
            try {
                const airdropHash = await execAirdrop(
                    api,
                    selectedToken,
                    addressList,
                    addresses
                );

                let firstTxIsDone: boolean = false;
                while (!firstTxIsDone) {
                    firstTxIsDone = await checkTxStatus(airdropHash);
                    await sleep(500);
                }

                /**
                 * check if airdrop is single transaction.
                 * if single tx, then airdrop is done in 1 tx
                 */

                if (airdropDetail.multiTx) {
                    const airdropTransactionsToSign = await getAirdrop(
                        airdropHash
                    );
                    /**
                     * airdrop successful
                     */
                    dispatch(
                        showModal({
                            text: "Your token UTxO has been prepared for the airdrop! Please sign the transactions to airdrop",
                            type: ModalTypes.success,
                        })
                    );
                    setMultiTxTransactions(
                        airdropTransactionsToSign.map((tx) => tx)
                    );
                } else {
                    /**
                     * airdrop successful
                     */
                    dispatch(
                        showModal({
                            text: "Airdrop successful!",
                            type: ModalTypes.success,
                        })
                    );
                }
            } catch (e) {
                dispatch(
                    showModal({
                        text: "Airdrop failed :(",
                        type: ModalTypes.failure,
                    })
                );
            }
            setLoading(false);
        } else {
            /**
             * if not yet validated,
             * validate airdrop transaction
             */
            // do validation
            if (!selectedToken) return;
            setLoading(true);
            const airdropRequest: AirdropRequest = await validateAirdropRequest(
                selectedToken,
                addressList,
                addresses
            );

            if (!airdropRequest.valid) {
                dispatch(
                    showModal({
                        text: airdropRequest.errorMessage
                            ? airdropRequest.errorMessage
                            : "Something is wrong :(",
                        type: ModalTypes.failure,
                    })
                );
                setLoading(false);
                return;
            }

            if (airdropRequest.detail == null) return;

            setAirdropDetail(airdropRequest.detail);
            setValidated(true);
            setLoading(false);
            dispatch(
                showModal({
                    text: "Airdrop transactions has been validated! You can now send your airdrop",
                    type: ModalTypes.success,
                })
            );
        }
    };

    return {
        selectedToken,
        tokens,
        setSelectedToken,
        validated,
        exec,
        addressList,
        handleAddressList,
        airdropDetail,
        totalToken,
        loading,
        multiTxTransactions,
    };
};

export default useToken;

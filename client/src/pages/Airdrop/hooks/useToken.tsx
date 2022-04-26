import {
    AdaAddress,
    getTokenArrayInWallet,
    Token,
    validateAirdropRequest,
    TokenAddress,
    AirdropRequest,
    AirdropDetail,
    execAirdrop,
} from "../utils";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/store";
import { showModal } from "src/reducers/modalSlice";

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
            await execAirdrop(api, selectedToken, addressList, addresses);
            dispatch(showModal("Airdrop successful!"));
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
            if (!airdropRequest.valid) return;
            if (airdropRequest.detail == null) return;
            setAirdropDetail(airdropRequest.detail);
            setValidated(true);
            setLoading(false);
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
    };
};

export default useToken;

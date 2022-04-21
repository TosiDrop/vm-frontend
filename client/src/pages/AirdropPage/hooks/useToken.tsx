import {
    AdaAddress,
    getTokenArrayInWallet,
    Token,
    validateAirdropRequest,
    TokenAddress,
    AirdropRequest,
    AirdropDetail,
} from "../utils";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "src/store";

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
    const api = useSelector((state: RootState) => state.wallet.api);

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
            console.log("airdropping");
            /**
             * if the transaction is validated,
             * execute airdrop
             */
        } else {
            /**
             * if not yet validated,
             * validate airdrop transaction
             */
            // do validation
            if (!selectedToken) return;
            const airdropRequest: AirdropRequest = await validateAirdropRequest(
                selectedToken,
                addressList,
                addresses
            );
            if (!airdropRequest.valid) return;
            if (airdropRequest.detail == null) return;
            setAirdropDetail(airdropRequest.detail);
            setValidated(true);
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
    };
};

export default useToken;

import {
    AdaAddress,
    getTokenArrayInWallet,
    Token,
    validateAirdropRequest,
    TokenAddress,
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
    const api = useSelector((state: RootState) => state.wallet.api);

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
        } else {
            /**
             * if not yet validated,
             * validate airdrop transaction
             */
            // do validation
            if (!selectedToken) return;
            await validateAirdropRequest(selectedToken, addressList, addresses);
        }
    };

    return {
        selectedToken,
        tokens,
        setSelectedToken,
        validated,
        exec,
        addressList,
        setAddressList,
    };
};

export default useToken;

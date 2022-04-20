import { getTokenArrayInWallet, Token } from "../utils";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "src/store";

const useToken = () => {
    const [selectedToken, setSelectedToken] = useState<Token | null>(null);
    const [tokens, setTokens] = useState<Token[]>([]);
    const [validated, setValidated] = useState(false);
    const api = useSelector((state: RootState) => state.wallet.api);

    useEffect(() => {
        (async () => {
            if (api) {
                const tokenArray = await getTokenArrayInWallet(api);
                setTokens(tokenArray);
            }
        })();
    }, [api]);

    const exec = () => {};

    return {
        selectedToken,
        tokens,
        setSelectedToken,
        validated,
        exec,
    };
};

export default useToken;

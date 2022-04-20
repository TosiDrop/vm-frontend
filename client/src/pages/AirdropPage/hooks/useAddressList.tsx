import { useState } from "react";
import { TokenAddress, shortenAddress } from "../utils";

const useAddressList = () => {
    const [addressList, setAddressList] = useState<TokenAddress[]>([]);

    return {
        addressList,
        shortenAddress,
        setAddressList,
    };
};

export default useAddressList;

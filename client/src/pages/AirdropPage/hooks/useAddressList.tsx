import { useState } from "react";
import { AirdropAddress } from "src/entities/common.entities";

const useAddressList = () => {
    const [addressList, setAddressList] = useState<AirdropAddress[]>([]);

    const shortenAddr = (addr: string) => {
        return `${addr.slice(0, 5)}...${addr.slice(addr.length - 10)}`;
    };

    return {
        addressList,
        shortenAddr,
        setAddressList,
    };
};

export default useAddressList;

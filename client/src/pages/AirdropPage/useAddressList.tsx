import { useState } from "react";
import { AirdropAddress } from "src/entities/common.entities";

const useAddressList = () => {
    const [addressList, setAddressList] = useState<AirdropAddress[]>([]);
    return {
        addressList,
        setAddressList,
    };
};

export default useAddressList;

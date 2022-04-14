import { useState } from "react";

const useAddressList = () => {
    const [addressList, setAddressList] = useState([
        { address: "dwq", amount: 30 },
        { address: "dwq", amount: 30 },
        { address: "dwq", amount: 30 },
        { address: "dwq", amount: 30 },
        { address: "dwq", amount: 30 },
        { address: "dwq", amount: 30 },
        { address: "dwq", amount: 30 },
        { address: "dwq", amount: 30 },
    ]);
    return {
        addressList,
        setAddressList,
    };
};

export default useAddressList;

import { useState } from "react";
import { useSelector } from "react-redux";
import { checkTxStatus, sleep, transact } from "../../utils";
import Spinner from "../Spinner";
import { RootState } from "src/store";
import "./index.scss";

const CLASS = "transaction-bar";

interface Props {
    cborHex: string;
    description: string;
}

enum TxStatus {
    success,
    fail,
    loading,
    toSign,
}

const TransactionBar = ({ cborHex, description }: Props) => {
    const [status, setStatus] = useState(TxStatus.toSign);
    const api = useSelector((state: RootState) => state.wallet.api);

    const signTx = async () => {
        const airdropHash = await transact(api, cborHex, description);
        let txDone: boolean = false;
        while (!txDone) {
            txDone = await checkTxStatus(airdropHash);
            await sleep(500);
        }
        console.log(txDone);
    };

    const renderStatus = () => {
        switch (status) {
            case TxStatus.toSign:
                return (
                    <button
                        className={`${CLASS}__button ${CLASS}__button-airdrop`}
                        onClick={() => signTx()}
                    >
                        Sign
                    </button>
                );
            case TxStatus.loading:
                return <Spinner></Spinner>;
            case TxStatus.fail:
            case TxStatus.success:
            default:
                return null;
        }
    };

    return (
        <div className={`${CLASS}`}>
            TX Info
            {renderStatus()}
        </div>
    );
};

export default TransactionBar;

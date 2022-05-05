import { useState } from "react";
import { useSelector } from "react-redux";
import { sleep, transact } from "../../utils";
import { getTxStatus } from "src/services/airdrop.services";
import Spinner from "../../../../components/Spinner";
import { RootState } from "src/store";
import "./index.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const CLASS = "transaction-bar";

interface Props {
    cborHex: string;
    description: string;
    i: number;
}

enum TxStatus {
    success,
    fail,
    loading,
    toSign,
}

const TransactionBar = ({ cborHex, description, i }: Props) => {
    const [status, setStatus] = useState(TxStatus.toSign);
    const api = useSelector((state: RootState) => state.wallet.api);

    const signTx = async () => {
        try {
            const airdropTx = await transact(api, cborHex, description);
            const airdropHash = airdropTx.airdrop_hash;
            let txDone: boolean = false;
            setStatus(TxStatus.loading);
            while (!txDone) {
                txDone = await getTxStatus(airdropHash);
                await sleep(500);
            }
            setStatus(TxStatus.success);
        } catch (e) {
            setStatus(TxStatus.fail);
        }
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
            case TxStatus.success:
                return <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>;
            case TxStatus.fail:
            default:
                return null;
        }
    };

    return (
        <div className={`${CLASS}`}>
            Transaction {i + 1}
            {renderStatus()}
        </div>
    );
};

export default TransactionBar;

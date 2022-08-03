import { useSelector } from "react-redux";
import Spinner from "src/components/Spinner";
import { NetworkId } from "src/entities/common.entities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RootState } from "src/store";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

enum TransactionStatusDetail {
    waiting = 0,
    processing = 1,
    failure = 2,
    success = 3,
}

interface Params {
    transactionStatus: TransactionStatusDetail;
    transactionId: string;
}

const TransactionStatus = ({ transactionStatus, transactionId }: Params) => {
    const networkId = useSelector((state: RootState) => state.wallet.networkId);

    const renderTxId = () => {
        let cardanoScanUrl = "";
        switch (networkId) {
            case NetworkId.mainnet:
                cardanoScanUrl = "https://cardanoscan.io/transaction";
                break;
            case NetworkId.testnet:
            default:
                cardanoScanUrl = "https://testnet.cardanoscan.io/transaction";
        }
        return transactionId ? (
            <div className="">
                Transaction ID:{" "}
                <a
                    target="_blank"
                    rel="noreferrer"
                    style={{ marginLeft: "5px" }}
                    href={`${cardanoScanUrl}/${transactionId}`}
                >
                    {transactionId}{" "}
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                </a>
            </div>
        ) : null;
    };

    const renderStatus = () => {
        switch (transactionStatus) {
            case TransactionStatusDetail.waiting:
                return (
                    <div className="">
                        <div className="">
                            <div>Status: </div>
                            <div>waiting for deposit</div>
                        </div>
                    </div>
                );
            case TransactionStatusDetail.processing:
                return (
                    <div className="">
                        {renderTxId()}
                        <div className="">
                            <div>Status: </div>
                            <div className="">processing transaction</div>
                            <Spinner></Spinner>
                        </div>
                    </div>
                );
            case TransactionStatusDetail.success:
                return (
                    <>
                        Status: Transaction successful! Your tokens will arrive
                        soon 🎉
                    </>
                );
            case TransactionStatusDetail.failure:
            default:
                return (
                    <div className="">
                        {renderTxId()}
                        Status: transaction fails, please try again
                    </div>
                );
        }
    };
    return (
        <div className="background rounded-2xl p-5 mt-5">{renderStatus()}</div>
    );
};

export default TransactionStatus;

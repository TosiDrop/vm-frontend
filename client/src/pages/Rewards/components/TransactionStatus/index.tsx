import { useSelector } from "react-redux";
import Spinner from "src/components/Spinner";
import { NetworkId } from "src/entities/common.entities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RootState } from "src/store";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import "./index.scss";

const CLASS = "transaction-status";

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
            <div className={`${CLASS}__status-row`}>
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
                    <div className={`${CLASS}__row ${CLASS}__status`}>
                        <div className={`${CLASS}__status-row`}>
                            <div>Status: </div>
                            <div>waiting for deposit</div>
                        </div>
                    </div>
                );
            case TransactionStatusDetail.processing:
                return (
                    <div className={`${CLASS}__row ${CLASS}__status`}>
                        {renderTxId()}
                        <div className={`${CLASS}__status-row`}>
                            <div>Status: </div>
                            <div className={`${CLASS}__status-processing`}>
                                processing transaction
                            </div>
                            <Spinner></Spinner>
                        </div>
                    </div>
                );
            case TransactionStatusDetail.success:
                return (
                    <div className={`${CLASS}__row ${CLASS}__status`}>
                        <div className={`${CLASS}__status-row`}>
                            <div>Status: </div>
                            <div className={`${CLASS}__status-success`}>
                                Transaction successful! Your tokens will arrive
                                soon 🎉
                            </div>
                        </div>
                    </div>
                );
            case TransactionStatusDetail.failure:
            default:
                return (
                    <div className={`${CLASS}__row ${CLASS}__status`}>
                        {renderTxId()}
                        <div className={`${CLASS}__status-row`}>
                            <div>Status: </div>
                            <div className={`${CLASS}__status-fail`}>
                                transaction fails, please try again
                            </div>
                        </div>
                    </div>
                );
        }
    };
    return <div className={`rewards-block ${CLASS}`}>{renderStatus()}</div>;
};

export default TransactionStatus;

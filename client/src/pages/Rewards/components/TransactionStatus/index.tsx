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
    let cexplorerUrl = "";
    switch (networkId) {
      case NetworkId.mainnet:
        cexplorerUrl = "https://cexplorer.io/tx";
        break;
      case NetworkId.preview:
      default:
        cexplorerUrl = "https://preview.cexplorer.io/tx";
    }
    return transactionId ? (
      <div className="">
        Transaction ID:
        <a
          target="_blank"
          rel="noreferrer"
          href={`${cexplorerUrl}/${transactionId}`}
          className="text-violet-500 ml-2.5"
        >
          {transactionId} <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
        </a>
      </div>
    ) : null;
  };

  const renderStatus = () => {
    switch (transactionStatus) {
      case TransactionStatusDetail.waiting:
        return <>Status: waiting for deposit</>;
      case TransactionStatusDetail.processing:
        return (
          <div className="">
            {renderTxId()}
            <div className="flex flex-row items-center">
              Status: processing transaction{" "}
              <Spinner className="ml-2.5"></Spinner>
            </div>
          </div>
        );
      case TransactionStatusDetail.success:
        return (
          <>
            Status:{" "}
            <span className="text-green-600">
              Transaction successful! Your tokens will arrive soon 🎉
            </span>
          </>
        );
      case TransactionStatusDetail.failure:
      default:
        return (
          <div className="">
            {renderTxId()}
            Status:{" "}
            <span className="text-red-600">
              transaction fails, please try again
            </span>
          </div>
        );
    }
  };
  return (
    <div className="background rounded-2xl p-5 mt-5">{renderStatus()}</div>
  );
};

export default TransactionStatus;

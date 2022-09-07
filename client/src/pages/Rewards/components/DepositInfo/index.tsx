import { faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TransactionDetail from "../TransactionDetail";
import { formatTokens } from "src/services/utils.services";
import { GetCustomRewards } from "src/entities/vm.entities";
import SendAdaInfo from "../SendAdaInfo";
import TransactionStatus from "../TransactionStatus";
import { TransactionStatusDetail } from "../../DepositInfoPage";

const CLASS = "deposit-info";

interface Params {
  txDetail: GetCustomRewards | undefined;
  checkedCount: number;
  transactionId: string;
  transactionStatus: TransactionStatusDetail;
  setTransactionId: Function;
  setTransactionStatus: Function;
  unlock: boolean;
}

const DepositInfo = ({
  txDetail,
  checkedCount,
  transactionId,
  transactionStatus,
  setTransactionId,
  setTransactionStatus,
  unlock,
}: Params) => {
  return (
    <>
      <div className="bg-yellow-400 rounded-2xl p-5 mt-5 text-black">
        <FontAwesomeIcon className="mr-2.5" icon={faWarning} />
        <span>Please send ONLY from the wallet with the same stake key</span>
      </div>
      <div className="background rounded-2xl p-5 mt-5">
        <div className={`${CLASS}__info ${CLASS}__row`}>
          Please complete the withdrawal process by sending{" "}
          <b>{formatTokens(txDetail?.deposit.toString(), 6, 1)} ADA</b> using
          one of the following options:
          <ul>
            <li>• manual transfer to the address below,</li>
            <li>• transfer by scanning the QR code, or</li>
            <li>
              • <b>Send ADA</b> button (if your wallet is connected).
            </li>
          </ul>
        </div>
      </div>
      <TransactionStatus
        transactionId={transactionId}
        transactionStatus={transactionStatus}
      />
      {transactionStatus === TransactionStatusDetail.waiting ? (
        <SendAdaInfo
          txDetail={txDetail}
          setTransactionId={setTransactionId}
          setTransactionStatus={setTransactionStatus}
        />
      ) : null}
      {txDetail ? (
        <TransactionDetail
          numberOfTokens={checkedCount}
          deposit={txDetail.deposit}
          unlock={unlock}
          isWhitelisted={txDetail.is_whitelisted}
        ></TransactionDetail>
      ) : null}
    </>
  );
};

export default DepositInfo;

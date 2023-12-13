import { faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { GetCustomRewards } from "src/entities/vm.entities";
import { lovelaceToAda } from "src/utils";

import { TransactionStatusDetail } from "src/entities/common.entities";
import SendAdaInfo from "../SendAdaInfo";
import TransactionDetail from "../TransactionDetail";
import TransactionStatus from "../TransactionStatus";

interface Params {
  txDetail: GetCustomRewards | undefined;
  checkedCount: number;
  transactionId: string;
  transactionStatus: TransactionStatusDetail;
  setTransactionId: Function;
  setTransactionStatus: Function;
  unlock: boolean;
  native: boolean;
}

const DepositInfo = ({
  txDetail,
  checkedCount,
  transactionId,
  transactionStatus,
  setTransactionId,
  setTransactionStatus,
  unlock,
  native,
}: Params) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-yellow-400 rounded-2xl p-5 text-black">
        <FontAwesomeIcon className="mr-2.5" icon={faWarning} />
        <span>Cross-wallet claims are now supported!</span>
      </div>
      <div className="background rounded-2xl p-5">
        <div>
          Please complete the withdrawal process by sending{" "}
          <b>{lovelaceToAda(txDetail?.deposit ?? 0)} ADA</b> using one of the
          following options:
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
          native={native}
          isWhitelisted={txDetail.is_whitelisted}
        ></TransactionDetail>
      ) : null}
    </div>
  );
};

export default DepositInfo;

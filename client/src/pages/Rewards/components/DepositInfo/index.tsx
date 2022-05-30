import { faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TransactionDetail from "../TransactionDetail";
import { formatTokens } from "src/services/utils.services";
import { GetCustomRewards } from "src/entities/vm.entities";
import WalletApi from "src/services/connectors/wallet.connector";
import SendAdaInfo from "../SendAdaInfo";
import TransactionStatus from "../TransactionStatus";
import { TransactionStatusDetail } from "../../DepositInfoPage";
import "./index.scss";

const CLASS = "deposit-info";

interface Params {
    txDetail: GetCustomRewards | undefined;
    checkedCount: number;
    connectedWallet: WalletApi | undefined;
    wrongNetwork: boolean | undefined;
    transactionId: string;
    transactionStatus: TransactionStatusDetail;
    setTransactionId: Function;
    setTransactionStatus: Function;
}

const DepositInfo = ({
    txDetail,
    checkedCount,
    connectedWallet,
    wrongNetwork,
    transactionId,
    transactionStatus,
    setTransactionId,
    setTransactionStatus,
}: Params) => {
    return (
        <>
            <div className={`rewards-block ${CLASS}__warning ${CLASS}`}>
                <FontAwesomeIcon icon={faWarning} />
                <span>
                    Please send ONLY from the wallet with the same stake key
                </span>
            </div>
            <div className={`rewards-block ${CLASS}`}>
                <div className={`${CLASS}__info ${CLASS}__row`}>
                    Please complete the withdrawal process by sending{" "}
                    <b>
                        {formatTokens(txDetail?.deposit.toString(), 6, 1)} ADA
                    </b>{" "}
                    using one of the following options:
                    <ul>
                        <li>manual transfer to the address below,</li>
                        <li>transfer by scanning the QR code, or</li>
                        <li>
                            <b>Send ADA</b> button (if your wallet is
                            connected).
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
                    connectedWallet={connectedWallet}
                    wrongNetwork={wrongNetwork}
                    setTransactionId={setTransactionId}
                    setTransactionStatus={setTransactionStatus}
                />
            ) : null}
            {txDetail ? (
                <TransactionDetail
                    numberOfTokens={checkedCount}
                    deposit={txDetail.deposit}
                ></TransactionDetail>
            ) : null}
        </>
    );
};

export default DepositInfo;

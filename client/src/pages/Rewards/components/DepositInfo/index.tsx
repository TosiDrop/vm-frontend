import { ModalTypes } from "src/entities/common.entities";
import Spinner from "src/components/Spinner";
import { showModal } from "src/reducers/modalSlice";
import QRCode from "react-qr-code";
import { faCopy, faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TransactionDetail from "../TransactionDetail";
import { copyContent, formatTokens } from "src/services/utils.services";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getTxStatus } from "src/services/http.services";
import { GetCustomRewards, GetRewards } from "src/entities/vm.entities";
import WalletApi from "src/services/connectors/wallet.connector";
import "./index.scss";

const CLASS = "deposit-info";

interface Params {
    txDetail: GetCustomRewards | undefined;
    showTooltip: boolean;
    rewards: GetRewards | undefined;
    triggerTooltip: Function;
    checkedCount: number;
    connectedWallet: WalletApi | undefined;
    wrongNetwork: boolean | undefined;
    stakeAddress: string | undefined;
}

interface TransactionStatus {
    status: number;
}

enum TransactionStatusDetail {
    waiting = 0,
    processing = 1,
    failure = 2,
    success = 3,
}

const DepositInfo = ({
    txDetail,
    showTooltip,
    rewards,
    triggerTooltip,
    checkedCount,
    connectedWallet,
    wrongNetwork,
    stakeAddress,
}: Params) => {
    const dispatch = useDispatch();
    const [sendAdaSpinner, setSendAdaSpinner] = useState(false);
    const [transactionStatus, setTransactionStatus] =
        useState<TransactionStatusDetail>(TransactionStatusDetail.waiting);
    const [showDepositDetail, setShowDepositDetail] = useState(true);

    useEffect(() => {
        if (txDetail == null) return;
        if (stakeAddress == null) return;

        const checkTxStatus = setInterval(async () => {
            try {
                const txStatus: TransactionStatus = await getTxStatus(
                    txDetail.request_id,
                    stakeAddress.slice(0, 40)
                );
                const status = txStatus.status;
                switch (status) {
                    case TransactionStatusDetail.failure:
                    case TransactionStatusDetail.success:
                        setTransactionStatus(txStatus.status);
                        clearInterval(checkTxStatus);
                        break;
                    case TransactionStatusDetail.processing:
                        setTransactionStatus(txStatus.status);
                        break;
                    case TransactionStatusDetail.waiting:
                    default:
                        break;
                }
            } catch (e) {}
        }, 5000);

        return () => {
            clearInterval(checkTxStatus);
        };
    }, [txDetail]);

    const renderQRCode = (txDetail: any) => {
        if (txDetail == null) return null;
        return (
            <div className={`${CLASS}__row ${CLASS}__qr`}>
                <div className="qr-address">
                    <QRCode value={txDetail.withdrawal_address} size={180} />
                </div>
            </div>
        );
    };
    const renderSendAdaButton = () => {
        if (connectedWallet?.wallet?.api && !wrongNetwork) {
            return (
                <div className={`${CLASS}__row ${CLASS}__send-ada-btn`}>
                    <button className="tosi-button" onClick={sendADA}>
                        Send ADA {sendAdaSpinner ? <Spinner></Spinner> : null}
                    </button>
                </div>
            );
        } else {
            return null;
        }
    };

    const sendADA = async () => {
        if (rewards && txDetail) {
            setSendAdaSpinner(true);
            const txHash = await connectedWallet?.transferAda(
                txDetail.withdrawal_address,
                txDetail.deposit.toString()
            );
            if (!txHash) return;
            if (isTxHash(txHash)) {
                setTransactionStatus(TransactionStatusDetail.processing);
            } else {
                console.log('tx cancelled')
                dispatch(
                    showModal({
                        text: "User cancelled transaction",
                        type: ModalTypes.failure,
                    })
                );
            }
            setSendAdaSpinner(false);
        }
    };

    const renderStatus = () => {
        switch (transactionStatus) {
            case TransactionStatusDetail.waiting:
                return (
                    <div className={`${CLASS}__row ${CLASS}__status`}>
                        Status: <div>waiting for deposit</div>
                    </div>
                );
            case TransactionStatusDetail.processing:
                return (
                    <div className={`${CLASS}__row ${CLASS}__status`}>
                        Status:{" "}
                        <div className={`${CLASS}__status-processing`}>
                            processing transaction
                        </div>
                        <Spinner></Spinner>
                    </div>
                );
            case TransactionStatusDetail.success:
                return (
                    <div className={`${CLASS}__row ${CLASS}__status`}>
                        Status:{" "}
                        <div className={`${CLASS}__status-success`}>
                            Transaction successful! Your tokens will arrive soon
                            🎉
                        </div>
                    </div>
                );
            case TransactionStatusDetail.failure:
            default:
                return (
                    <div className={`${CLASS}__row ${CLASS}__status`}>
                        Status:{" "}
                        <div className={`${CLASS}__status-fail`}>
                            transaction fails, please try again
                        </div>
                    </div>
                );
        }
    };

    return (
        <>
            <div className={`${CLASS}__warning ${CLASS}`}>
                <FontAwesomeIcon icon={faWarning} />
                <span>
                    Please send ONLY from the wallet with the same stake key
                </span>
            </div>
            <div className={`${CLASS}`}>
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
            <div className={`${CLASS}`}>{renderStatus()}</div>
            {transactionStatus === TransactionStatusDetail.waiting ? (
                <div className={`${CLASS}`}>
                    <div className={`${CLASS}__row`}>Deposit Address</div>
                    <div className={`${CLASS}__address ${CLASS}__row`}>
                        <div
                            className={
                                "tooltip-icon" + (showTooltip ? "" : " hidden")
                            }
                        >
                            copied
                        </div>
                        <div
                            className="icon"
                            onClick={() => {
                                if (txDetail == null) return;
                                copyContent(
                                    rewards ? txDetail.withdrawal_address : ""
                                );
                                triggerTooltip();
                            }}
                        >
                            <FontAwesomeIcon icon={faCopy} />
                        </div>
                        <input
                            className="transparent-input"
                            type="text"
                            disabled={true}
                            value={txDetail?.withdrawal_address}
                        />
                    </div>
                    {renderQRCode(txDetail)}
                    {renderSendAdaButton()}
                </div>
            ) : null}
            {txDetail ? (
                <TransactionDetail
                    numberOfTokens={checkedCount}
                    withdrawalFee={200000}
                    deposit={txDetail.deposit}
                ></TransactionDetail>
            ) : null}
        </>
    );
};

export default DepositInfo;

const isTxHash = (txHash: string) => {
    return txHash.length === 64 && txHash.indexOf(" ") === -1;
};

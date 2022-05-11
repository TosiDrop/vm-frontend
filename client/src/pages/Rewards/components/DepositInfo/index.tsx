import { ModalTypes } from "src/entities/common.entities";
import Spinner from "src/components/Spinner";
import { showModal } from "src/reducers/modalSlice";
import QRCode from "react-qr-code";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TransactionDetail from "../TransactionDetail";
import { copyContent, formatTokens } from "src/services/utils.services";
import { useState } from "react";
import "./index.scss";
import { useDispatch } from "react-redux";

const CLASS = "deposit-info";

interface Params {
    txDetail: any;
    showTooltip: boolean;
    rewards: any;
    triggerTooltip: Function;
    checkedCount: number;
    connectedWallet: any;
    wrongNetwork: boolean | undefined;
}

const DepositInfo = ({
    txDetail,
    showTooltip,
    rewards,
    triggerTooltip,
    checkedCount,
    connectedWallet,
    wrongNetwork,
}: Params) => {
    const dispatch = useDispatch();
    const [sendAdaSpinner, setSendAdaSpinner] = useState(false);

    const renderQRCode = (txDetail: any) => {
        if (txDetail == null) return null;
        return (
            <div className="qr-address">
                <QRCode value={txDetail.withdrawal_address} size={180} />
            </div>
        );
    };
    const renderSendAdaButton = () => {
        if (connectedWallet?.wallet?.api && !wrongNetwork) {
            return (
                <button className="tosi-button" onClick={sendADA}>
                    Send ADA {sendAdaSpinner ? <Spinner></Spinner> : null}
                </button>
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
            if (txHash) {
                if (isTxHash(txHash)) {
                    dispatch(
                        showModal({
                            text: "Transaction ID: " + txHash,
                            type: ModalTypes.info,
                        })
                    );
                    // setPaymentStatus(PaymentStatus.AwaitingConfirmations);
                    // setPaymentTxAfterBlock(undefined);
                    // checkPaymentTransaction(txHash);
                } else {
                    // dispatch(
                    //     showModal({ text: txHash, type: ModalTypes.info })
                    // );
                }
            }
            setSendAdaSpinner(false);
        }
    };
    return (
        <>
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
                    Please send ONLY from the wallet with the same stake key.
                </div>
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
                        value={rewards?.vending_address}
                    />
                </div>
                <div className={`${CLASS}__row ${CLASS}__qr`}>
                    {renderQRCode(txDetail)}
                </div>
                <div className={`${CLASS}__row ${CLASS}__send-ada-btn`}>
                    {renderSendAdaButton()}
                </div>
            </div>
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

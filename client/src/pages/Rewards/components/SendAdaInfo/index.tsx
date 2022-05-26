import { ModalTypes } from "src/entities/common.entities";
import { showModal } from "src/reducers/modalSlice";
import { useState } from "react";
import { copyContent } from "src/services/utils.services";
import WalletApi from "src/services/connectors/wallet.connector";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import QRCode from "react-qr-code";
import Spinner from "src/components/Spinner";
import { isTxHash } from "src/pages/Rewards/utils/common.function";
import { useDispatch } from "react-redux";
import "./index.scss";

const CLASS = "send-ada-info";

interface Params {
    txDetail: any;
    connectedWallet: WalletApi | undefined;
    wrongNetwork: boolean | undefined;
    setTransactionId: Function;
    setTransactionStatus: Function;
}

enum TransactionStatusDetail {
    waiting = 0,
    processing = 1,
    failure = 2,
    success = 3,
}

const SendAdaInfo = ({
    txDetail,
    connectedWallet,
    wrongNetwork,
    setTransactionId,
    setTransactionStatus,
}: Params) => {
    const dispatch = useDispatch();
    const [showToolTip, setShowToolTip] = useState(false);
    const [sendAdaSpinner, setSendAdaSpinner] = useState(false);

    const triggerTooltip = () => {
        setShowToolTip(true);
        setTimeout(() => {
            setShowToolTip(false);
        }, 1000);
    };

    /**
     * render QR Code
     */
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

    /**
     * render button to send ada
     */
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

    /**
     * render input for manual copy
     */
    const renderManualCopy = () => {
        return (
            <div className={`${CLASS}__address ${CLASS}__row`}>
                <div
                    className={"tooltip-icon" + (showToolTip ? "" : " hidden")}
                >
                    copied
                </div>
                <div
                    className="icon"
                    onClick={() => {
                        if (txDetail == null) return;
                        copyContent(
                            txDetail ? txDetail.withdrawal_address : ""
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
        );
    };

    /**
     * function to open wallet and start TX
     */
    const sendADA = async () => {
        if (txDetail) {
            setSendAdaSpinner(true);
            const txHash = await connectedWallet?.transferAda(
                txDetail.withdrawal_address,
                txDetail.deposit.toString()
            );
            if (!txHash) return;
            if (isTxHash(txHash)) {
                setTransactionStatus(TransactionStatusDetail.processing);
                setTransactionId(txHash);
            } else {
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

    return (
        <div className={`rewards-block ${CLASS}`}>
            <div className={`${CLASS}__row`}>Deposit Address</div>
            {renderManualCopy()}
            {renderQRCode(txDetail)}
            {renderSendAdaButton()}
        </div>
    );
};

export default SendAdaInfo;

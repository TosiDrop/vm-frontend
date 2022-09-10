import { InfoModalTypes, ModalTypes } from "src/entities/common.entities";
import { showModal } from "src/reducers/globalSlice";
import { useState } from "react";
import { copyContent } from "src/services/utils.services";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import QRCode from "react-qr-code";
import Spinner from "src/components/Spinner";
import { isTxHash } from "src/pages/Rewards/utils/common.function";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/store";

interface Params {
  txDetail: any;
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
  setTransactionId,
  setTransactionStatus,
}: Params) => {
  const dispatch = useDispatch();
  const connectedWallet = useSelector(
    (state: RootState) => state.wallet.walletApi
  );
  const isWrongNetwork = useSelector(
    (state: RootState) => state.wallet.isWrongNetwork
  );
  const [showToolTip, setShowToolTip] = useState(false);
  const [sendAdaSpinner, setSendAdaSpinner] = useState(false);

  const triggerTooltip = () => {
    if (txDetail == null) return;
    copyContent(txDetail ? txDetail.withdrawal_address : "");
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
      <div className="w-full flex justify-center">
        <div className="bg-white rounded-lg p-2.5 w-fit">
          <QRCode value={txDetail.withdrawal_address} size={180} />
        </div>
      </div>
    );
  };

  /**
   * render button to send ada
   */
  const renderSendAdaButton = () => {
    if (connectedWallet?.wallet?.api && !isWrongNetwork) {
      return (
        <div className="w-full flex justify-center">
          <button
            className="tosi-button py-2.5 px-5 rounded-lg flex flex-row items-center"
            onClick={sendADA}
          >
            Send ADA{" "}
            {sendAdaSpinner ? (
              <div className="ml-2.5">
                <Spinner></Spinner>
              </div>
            ) : null}
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
      <div className="flex flex-row items-center w-full relative">
        <FontAwesomeIcon
          className="mr-2.5 cursor-pointer"
          onClick={() => triggerTooltip()}
          icon={faCopy}
        />
        <div className="p-1 rounded-lg border border-gray-400 grow overflow-auto">
          {txDetail?.withdrawal_address}
        </div>
        <div
          className={`p-2.5 left-8 rounded-lg absolute tooltip ${
            showToolTip ? "visible" : "invisible"
          }`}
        >
          copied!
        </div>
      </div>
    );
  };

  /**
   * function to open wallet and start TX
   */
  const sendADA = async () => {
    try {
      if (txDetail == null) throw new Error();
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
            modalType: ModalTypes.info,
            details: {
              text: "User cancelled transaction",
              type: InfoModalTypes.failure,
            },
          })
        );
      }
      setSendAdaSpinner(false);
    } catch (e) {
      setSendAdaSpinner(false);
      dispatch(
        showModal({
          modalType: ModalTypes.info,
          details: {
            text: "Something is wrong :(",
            type: InfoModalTypes.failure,
          },
        })
      );
    }
  };

  return (
    <div className="background rounded-2xl p-5 flex flex-col gap-4">
      Deposit Address
      {renderManualCopy()}
      {renderQRCode(txDetail)}
      {renderSendAdaButton()}
    </div>
  );
};

export default SendAdaInfo;

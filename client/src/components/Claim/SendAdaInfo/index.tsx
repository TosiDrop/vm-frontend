import { useState } from "react";
import QRCode from "react-qr-code";
import { useSelector } from "react-redux";

import Spinner from "src/components/Spinner";
import { isTxHash } from "src/utils";
import { RootState } from "src/store";
import Copyable from "src/components/Copyable";
import { lovelaceToAda } from "src/utils";
import useErrorHandler from "src/hooks/useErrorHandler";

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
  const { handleError } = useErrorHandler();
  const connectedWallet = useSelector(
    (state: RootState) => state.wallet.walletApi
  );
  const isWrongNetwork = useSelector(
    (state: RootState) => state.wallet.isWrongNetwork
  );
  const [sendAdaSpinner, setSendAdaSpinner] = useState(false);

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
   * function to open wallet and start TX
   */
  const sendADA = async () => {
    try {
      if (txDetail == null) throw new Error("Transaction not found");
      setSendAdaSpinner(true);
      const txHash = await connectedWallet?.transferAda(
        txDetail.withdrawal_address,
        txDetail.deposit.toString()
      );
      if (!txHash) throw new Error("Fail to hash transaction");
      if (isTxHash(txHash)) {
        setTransactionStatus(TransactionStatusDetail.processing);
        setTransactionId(txHash);
      } else {
        throw new Error("Fail to hash transaction");
      }
    } catch (e) {
      handleError(e);
    } finally {
      setSendAdaSpinner(false);
    }
  };

  return (
    <div className="background rounded-2xl p-5 flex flex-col gap-4">
      Deposit Address
      <div className="flex flex-row items-center gap-2">
        <div className="whitespace-nowrap">Deposit Address</div>
        <Copyable text={txDetail.withdrawal_address}></Copyable>
      </div>
      <div className="flex flex-row items-center gap-2">
        <div className="whitespace-nowrap">Deposit Amount</div>
        <Copyable text={String(lovelaceToAda(txDetail.deposit))}></Copyable>
      </div>
      {renderQRCode(txDetail)}
      {renderSendAdaButton()}
    </div>
  );
};

export default SendAdaInfo;

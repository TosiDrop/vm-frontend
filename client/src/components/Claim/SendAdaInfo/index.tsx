import QRCode from "react-qr-code";
import Copyable from "src/components/Copyable";
import Spinner from "src/components/Spinner";
import useTransfer from "src/hooks/cardano/useTransfer";
import { useWalletConnector } from "src/pages/Cardano/Claim/useWalletConnector";
import { lovelaceToAda } from "src/utils";

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

const SendAdaInfo = ({ txDetail, setTransactionId, setTransactionStatus }: Params) => {
  const { wallet, networkId } = useWalletConnector();
  const connectedWalletApi = wallet;
  const isWrongNetwork = networkId !== 1;
  const { transfer, loading: transferLoading } = useTransfer();

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
    if (connectedWalletApi && !isWrongNetwork) {
      return (
        <div className="w-full flex justify-center">
          <button
            className="tosi-button py-2.5 px-5 rounded-lg flex flex-row items-center"
            onClick={sendADA}
          >
            Send ADA{" "}
            {transferLoading ? (
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

  const sendADA = async () => {
    if (txDetail == null) throw new Error("Transaction not found");
    await transfer(
      {
        toAddress: txDetail.withdrawal_address,
        amountToSend: txDetail.deposit.toString(),
      },
      (txId) => {
        setTransactionStatus(TransactionStatusDetail.processing);
        setTransactionId(txId);
      }
    );
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

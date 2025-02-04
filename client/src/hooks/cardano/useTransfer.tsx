import { useState } from "react";
import { createTransferTx, submitStakeTx } from "src/services/common";
import useErrorHandler from "../useErrorHandler";
import { useWalletConnector } from "src/pages/Cardano/Claim/useWalletConnector";

export default function useTransfer() {
  const [loading, setLoading] = useState(false);
  const { handleError } = useErrorHandler();
  const { wallet, address } = useWalletConnector();
  const connectedWalletApi = wallet;
  const connectedWalletAddress = address;

  async function transfer(
    { toAddress, amountToSend }: { toAddress: string; amountToSend: string },
    callback?: (txId?: string) => void
  ) {
    setLoading(true);
    try {
      if (connectedWalletApi == null) {
        throw new Error("Please connect your wallet to transfer");
      }
      const { witness, txBody } = await createTransferTx({
        fromAddress: connectedWalletAddress ?? "",
        toAddress,
        amountToSend,
      });
      const signedWitness = await connectedWalletApi.signTx(witness);
      const { tx } = await submitStakeTx({ signedWitness, txBody });
      const txId = await connectedWalletApi.submitTx(tx);
      if (callback != null) {
        callback(txId);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }

  return {
    transfer,
    loading,
  };
}

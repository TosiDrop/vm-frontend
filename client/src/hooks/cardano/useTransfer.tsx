import { useState } from "react";
import { createTransferTx, submitStakeTx } from "src/services/common";
import useErrorHandler from "../useErrorHandler";
import { useWalletConnector } from "src/pages/Cardano/Claim/useWalletConnector";

export default function useTransfer() {
  const [loading, setLoading] = useState(false);
  const { handleError } = useErrorHandler();
  const { wallet, address } = useWalletConnector();

  async function transfer(
    { toAddress, amountToSend }: { toAddress: string; amountToSend: string },
    callback?: (txId?: string) => void
  ) {
    setLoading(true);
    try {
      if (wallet == null) {
        throw new Error("Please connect your wallet to transfer");
      }
      if (address == null) {
        throw new Error("From address is not available. Please ensure your wallet is connected.");
      }
      const { witness, txBody } = await createTransferTx({
        fromAddress: address,
        toAddress,
        amountToSend,
      });
      const signedWitness = await wallet.signTx(witness);
      const { tx } = await submitStakeTx({ signedWitness, txBody });
      const txId = await wallet.submitTx(tx);
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

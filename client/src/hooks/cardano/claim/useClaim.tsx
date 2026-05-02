import { useState } from "react";
import { useSelector } from "react-redux";
import { useWalletConnector } from "src/pages/Cardano/Claim/useWalletConnector";
import { createClaimTx, submitStakeTx } from "src/services/common";
import { RootState } from "src/store";
import useErrorHandler from "../../useErrorHandler";

export default function useClaim() {
  const [loading, setLoading] = useState(false);
  const { handleError } = useErrorHandler();
  const { wallet } = useWalletConnector();
  const { address } = useSelector((state: RootState) => state.wallet);

  async function claim(
    { toAddress, amountToSend }: { toAddress: string; amountToSend: string },
    callback?: (txId?: string) => void,
  ) {
    setLoading(true);
    try {
      if (!wallet) {
        throw new Error("Please connect your wallet to claim");
      }
      if (!address) {
        throw new Error(
          "From address is not available. Please ensure your wallet is connected.",
        );
      }

      const { witness, txBody, auxData } = await createClaimTx({
        fromAddress: address,
        toAddress,
        amountToSend,
      });
      const signedWitness = await wallet.signTx(witness);
      const { tx } = await submitStakeTx({ signedWitness, txBody, auxData });
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
    claim,
    loading,
  };
}

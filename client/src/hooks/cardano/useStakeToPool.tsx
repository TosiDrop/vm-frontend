import { useState } from "react";
import { createStakeTx, submitStakeTx } from "src/services/common";
import useErrorHandler from "../useErrorHandler";
import { useWalletConnector } from "src/pages/Cardano/Claim/useWalletConnector";

export default function useStakeToPool() {
  const [loading, setLoading] = useState(false);
  const { handleError } = useErrorHandler();
  const { wallet, address } = useWalletConnector();
  const connectedWalletApi = wallet;
  const connectedWalletAddress = address;

  async function stakeToPool(poolId: string, callback?: () => void) {
    setLoading(true);
    try {
      if (connectedWalletApi == null) {
        throw new Error("Please connect your wallet to delegate");
      }
      const { witness, txBody } = await createStakeTx({
        poolId,
        address: connectedWalletAddress ?? "",
      });
      const signedWitness = await connectedWalletApi.signTx(witness);
      const { tx } = await submitStakeTx({ signedWitness, txBody });
      await connectedWalletApi.submitTx(tx);
      if (callback != null) {
        callback();
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }

  return {
    stakeToPool,
    loading,
  };
}

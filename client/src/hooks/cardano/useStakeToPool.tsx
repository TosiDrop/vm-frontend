import { useState } from "react";
import { useSelector } from "react-redux";
import { createStakeTx, submitStakeTx } from "src/services/common";
import { RootState } from "src/store";
import useErrorHandler from "../useErrorHandler";

export default function useStakeToPool() {
  const [loading, setLoading] = useState(false);
  const { handleError } = useErrorHandler();
  const connectedWalletApi = useSelector(
    (state: RootState) => state.wallet.walletApi
  );
  const connectedWalletAddress = useSelector(
    (state: RootState) => state.wallet.walletAddress
  );

  async function stakeToPool(poolId: string, callback?: () => void) {
    setLoading(true);
    try {
      if (connectedWalletApi == null) {
        throw new Error("Please connect your wallet to delegate");
      }
      const { witness, txBody } = await createStakeTx({
        poolId,
        address: connectedWalletAddress,
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

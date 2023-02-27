import { useState } from "react";
import { useSelector } from "react-redux";
import { createStakeTx, submitStakeTx } from "src/services/common";
import { RootState } from "src/store";
import useErrorHandler from "../useErrorHandler";

export default function useStakeToPool() {
  const [loading, setLoading] = useState(false);
  const { handleError } = useErrorHandler();
  const connectedWallet = useSelector(
    (state: RootState) => state.wallet.walletApi
  );

  async function stakeToPool(poolId: string, callback?: () => void) {
    setLoading(true);
    try {
      if (connectedWallet == null) {
        throw new Error("Please connect your wallet to delegate");
      }
      const address = await connectedWallet.getBech32Address();
      const { witness, txBody } = await createStakeTx({ poolId, address });
      const signedWitness = await connectedWallet.signTx(witness);
      const { tx } = await submitStakeTx({ signedWitness, txBody });
      await connectedWallet.wallet?.api.submitTx(tx);
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

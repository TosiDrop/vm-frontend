import { useEffect } from "react";
import CheckRewardInput from "src/components/Claim/CheckRewardInput";
import RewardsView from "src/components/Claim/RewardsView";
import { useConnectWallet } from "@newm.io/cardano-dapp-wallet-connector";
import useClaimReward from "src/hooks/cardano/claim/useClaimReward";
import { useQueue } from "src/hooks/cardano/claim/useQueue";
import {
  setFailed,
  setLoading,
  setWalletDetails,
} from "src/reducers/walletSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "src/store"; // Adjust the import path as necessary

function Claim() {
  const {
    searchAddress,
    setSearchAddress,
    checkRewards,
    isCheckRewardLoading,
    isClaimRewardLoading,
    selectAll,
    cancelClaim,
    claimableTokens,
    handleTokenSelect,
    numberOfSelectedTokens,
    claimRewards,
    poolInfo,
    maxTokenSelected,
    selectRandomTokens,
  } = useClaimReward();
  const { wallet, getAddress } = useConnectWallet();
  const queue = useQueue();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    let active = true;

    const fetchWalletDetails = async () => {
      if (!wallet) {
        dispatch(setWalletDetails({ address: null, networkId: null }));
        return;
      }

      dispatch(setLoading());
      try {
        const networkId = await wallet.getNetworkId();

        const address = await new Promise<string>((resolve) => {
          getAddress((addr: string) => resolve(addr));
        });

        if (!active) return;
        dispatch(setWalletDetails({ address, networkId }));
      } catch {
        if (!active) return;
        dispatch(setWalletDetails({ address: null, networkId: null }));
        dispatch(setFailed());
      }
    };

    fetchWalletDetails();
    return () => {
      active = false;
    };
  }, [wallet, getAddress, dispatch]);

  return (
    <>
      <div className="text-3xl flex items-center gap-2">
        Claim your rewards
        <div className="background rounded-lg w-fit text-sm h-full flex items-center justify-center px-2.5">
          Queue: {queue}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <CheckRewardInput
          searchAddress={searchAddress}
          setSearchAddress={setSearchAddress}
          checkRewards={checkRewards}
          isSearchDisabledAndStakingInfoShown={claimableTokens.length === 0}
          isRewardLoading={isCheckRewardLoading}
          cancelClaim={cancelClaim}
        />
        <RewardsView
          claimableTokens={claimableTokens}
          handleTokenSelect={handleTokenSelect}
          numberOfSelectedTokens={numberOfSelectedTokens}
          claimRewards={claimRewards}
          isLoadingClaimReward={isClaimRewardLoading}
          selectAll={selectAll}
          poolInfo={poolInfo}
          maxTokenSelected={maxTokenSelected}
          selectRandomTokens={selectRandomTokens}
        />
      </div>
    </>
  );
}

export default Claim;

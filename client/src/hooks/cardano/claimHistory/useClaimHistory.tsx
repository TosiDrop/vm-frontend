import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  DeliveredReward,
  InfoModalTypes,
  ModalTypes,
} from "src/entities/common.entities";
import useErrorHandler from "src/hooks/useErrorHandler";
import { showModal } from "src/reducers/globalSlice";
import { getDeliveredRewards } from "src/services/claim";
import { getStakeKey } from "src/services/common";

export default function useClaimHistory() {
  const dispatch = useDispatch();
  const { handleError } = useErrorHandler();
  const [claimHistory, setClaimHistory] = useState<DeliveredReward[]>([]);
  const [loading, setLoading] = useState(false);

  async function checkClaimHistory(searchAddress: string) {
    if (!searchAddress) {
      throw new Error("No address provided!");
    }

    try {
      setLoading(true);
      const address = await getStakeKey(searchAddress);
      const stakingAddress = address.staking_address;

      let getRewardsHistory = await getDeliveredRewards(stakingAddress);

      if (getRewardsHistory.deliveredRewards.length) {
        setClaimHistory(getRewardsHistory.deliveredRewards);
        setLoading(false);
      } else {
        dispatch(
          showModal({
            modalType: ModalTypes.info,
            details: {
              text: "No claim history found for the account, yet.",
              type: InfoModalTypes.info,
            },
          })
        );
      }
    } catch (e: unknown) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  }

  return {
    claimHistory,
    checkClaimHistory,
    loading,
  };
}

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  InfoModalTypes,
  ModalTypes,
  ParsedReward,
} from "src/entities/common.entities";
import { GetRewardsHistory, GetTokens } from "src/entities/vm.entities";
import useErrorHandler from "src/hooks/useErrorHandler";
import { showModal } from "src/reducers/globalSlice";
import { getDeliveredRewards } from "src/services/claim";
import { getStakeKey, getTokens } from "src/services/common";

const Buffer = require("buffer").Buffer;

export default function useClaimHistory() {
  const dispatch = useDispatch();
  const { handleError } = useErrorHandler();
  const [tokensInfo, setTokensInfo] = useState<GetTokens>({});
  const [claimHistory, setClaimHistory] = useState<ParsedReward[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function init() {
      let info = await getTokens();
      setTokensInfo(info);
    }
    init();
  }, []);

  function parseRewardHistory(history: GetRewardsHistory[]): ParsedReward[] {
    type RewardMap = Record<string, ParsedReward>;
    const rewardMap: RewardMap = {};

    for (let entry of history) {
      let ticker: string;
      if (entry.token === "lovelace") {
        ticker = "ADA";
      } else {
        ticker = Buffer.from(entry.token.split(".")[1], "hex").toString("utf8");
      }

      const key = `${entry.delivered_on}_${ticker}`;
      let decimals = 0;

      if (tokensInfo != null) {
        if (tokensInfo[entry.token]?.decimals) {
          decimals = Number(tokensInfo[entry.token].decimals);
        }
      }

      if (rewardMap[key]) {
        rewardMap[key].amount += Number(entry.amount);
      } else {
        rewardMap[key] = {
          token: entry.token,
          amount: Number(entry.amount),
          delivered_on: entry.delivered_on,
          ticker,
          decimals,
        };
      }
    }

    return Object.values(rewardMap);
  }

  async function checkClaimHistory(searchAddress: string) {
    if (!searchAddress) return;
    try {
      setLoading(true);
      const address = await getStakeKey(searchAddress);
      const stakingAddress = address.staking_address;

      let getRewardsHistory = await getDeliveredRewards(stakingAddress);

      if (getRewardsHistory?.length) {
        let parsedHistory = parseRewardHistory(getRewardsHistory as any[]);
        setClaimHistory(parsedHistory);
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

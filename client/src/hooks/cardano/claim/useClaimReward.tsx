import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageRoute } from "src/entities/common.entities";
import { ClaimableToken, VmPoolInfo } from "src/entities/vm.entities";
import useErrorHandler from "src/hooks/useErrorHandler";
import useModal from "src/hooks/useModal";
import { useWalletConnector } from "src/pages/Cardano/Claim/useWalletConnector";
import { getCustomRewards, getRewards } from "src/services/claim";
import { getSettings, getStakeKey } from "src/services/common";
import { shuffleArray } from "src/utils";

export default function useClaimReward() {
  const navigate = useNavigate();
  const { handleError } = useErrorHandler();
  const { showInfoModal } = useModal();
  const { address } = useWalletConnector();
  // const connectedWalletAddress = address;
  // const isWrongNetwork = networkId !== 1;

  const [searchAddress, setSearchAddress] = useState("");
  const [claimableTokens, setClaimableTokens] = useState<ClaimableToken[]>([]);
  const [poolInfo, setPoolInfo] = useState<VmPoolInfo | null>(null);
  const [isCheckRewardLoading, setIsCheckRewardLoading] = useState(false);
  const [isClaimRewardLoading, setIsClaimRewardLoading] = useState(false);
  const [stakeAddress, setStakeAddress] = useState<string>("");
  const [numberOfSelectedTokens, setNumberOfSelectedTokens] = useState(0);
  /** default max number of token to claim */
  const [maxTokenSelected, setMaxTokenSelected] = useState(1000);

  useEffect(() => {
    if (address) {
      setSearchAddress(address);
    }
  }, [address]);

  useEffect(() => {
    setNumberOfSelectedTokens(
      claimableTokens.reduce((agg, i) => {
        if (i.selected && i.ticker !== "ADA") {
          agg += 1;
        }
        return agg;
      }, 0),
    );
  }, [claimableTokens]);

  const handleTokenSelect = (position: number) => {
    const updatedClaimableTokens = [...claimableTokens];

    if (
      !updatedClaimableTokens[position].selected &&
      numberOfSelectedTokens === maxTokenSelected
    ) {
      showInfoModal(
        `You have selected the maximum number of tokens to claim (${maxTokenSelected}).
         Please deselect other tokens first`,
      );
      return;
    }
    if (updatedClaimableTokens[position].ticker === "ADA") {
      updatedClaimableTokens[position].selected = true;
    } else {
      updatedClaimableTokens[position].selected =
        !updatedClaimableTokens[position].selected;
    }
    setClaimableTokens(updatedClaimableTokens);
  };

  const selectAll = () => {
    const updatedClaimableTokens = [...claimableTokens];
    updatedClaimableTokens.forEach((_) => (_.selected = false));
    // const limit = Math.min(maxTokenSelected, claimableTokens.length);
    // if (numberOfSelectedTokens !== limit) {
    //   for (let i = 0; i < limit; i++) {
    //     updatedClaimableTokens[i].selected = true;
    //   }
    // }
    setClaimableTokens(updatedClaimableTokens);
  };

  const selectRandomTokens = () => {
    const positions = shuffleArray([
      ...Array(claimableTokens.length).keys(),
    ]).slice(0, maxTokenSelected);

    const updatedClaimableTokens = [...claimableTokens];
    updatedClaimableTokens.forEach((token) => (token.selected = false));
    positions.forEach(
      (position) => (updatedClaimableTokens[position].selected = true),
    );

    setClaimableTokens(updatedClaimableTokens);
  };

  const checkRewards = async () => {
    setIsCheckRewardLoading(true);
    try {
      let address = await getStakeKey(searchAddress);
      address = address.staking_address;
      setStakeAddress(address);

      const [getRewardsResponse, vmSettings] = await Promise.all([
        getRewards(address),
        getSettings(),
      ]);

      if (getRewardsResponse == null) {
        throw new Error("Something went wrong when checking reward");
      }

      if (getRewardsResponse.claimable_tokens.length === 0) {
        showInfoModal("No rewards found for the account, yet.");
        return;
      }

      if (vmSettings.max_assets_in_request) {
        setMaxTokenSelected(vmSettings.max_assets_in_request);
      }

      setClaimableTokens(
        getRewardsResponse.claimable_tokens
          .map((token) => {
            token.selected = token.ticker === "ADA" ? true : false;
            return token;
          })
          .sort((a, b) => {
            if (a.ticker === "ADA") {
              return -1;
            } else if (b.ticker === "ADA") {
              return 1;
            } else if (a.ticker < b.ticker) {
              return -1;
            } else {
              return a.ticker === "ADA" ? -1 : 1;
            }
          }),
      );
      setPoolInfo(getRewardsResponse.pool_info);
      setIsCheckRewardLoading(false);
    } catch (e: any) {
      handleError(e);
    } finally {
      setIsCheckRewardLoading(false);
    }
  };

  const claimRewards = async () => {
    if (numberOfSelectedTokens === 0) return;

    setIsClaimRewardLoading(true);

    const selectedTokenId: string[] = [];
    claimableTokens.forEach((token) => {
      if (token.selected) {
        selectedTokenId.push(token.assetId);
      }
    });

    try {
      const res = await getCustomRewards(
        stakeAddress,
        stakeAddress.slice(0, 40),
        selectedTokenId.join(","),
      );
      if (res == null) throw new Error();

      let depositInfoUrl = `${PageRoute.depositCardano}?stakeAddress=${stakeAddress}&withdrawAddress=${res.withdrawal_address}&requestId=${res.request_id}&selectedTokens=${numberOfSelectedTokens}&unlock=true&native=false&isWhitelisted=${res.is_whitelisted}`;
      navigate(depositInfoUrl, { replace: true });
    } catch (e) {
      handleError(e);
    } finally {
      setIsClaimRewardLoading(false);
    }
  };

  const cancelClaim = async () => {
    setClaimableTokens([]);
  };

  return {
    searchAddress,
    setSearchAddress,
    checkRewards,
    claimRewards,
    selectAll,
    selectRandomTokens,
    cancelClaim,
    claimableTokens,
    handleTokenSelect,
    numberOfSelectedTokens,
    isCheckRewardLoading,
    isClaimRewardLoading,
    poolInfo,
    maxTokenSelected,
  };
}

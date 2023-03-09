import { useSelector } from "react-redux";

import { RootState } from "src/store";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  InfoModalTypes,
  ModalTypes,
  PageRoute,
} from "src/entities/common.entities";
import { ClaimableToken, VmPoolInfo } from "src/entities/vm.entities";
import useErrorHandler from "src/hooks/useErrorHandler";
import { showModal } from "src/reducers/globalSlice";
import { getCustomRewards, getRewards } from "src/services/claim";
import { getStakeKey } from "src/services/common";

export default function useClaimReward() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { handleError } = useErrorHandler();
  const connectedWalletAddress = useSelector(
    (state: RootState) => state.wallet.walletAddress
  );
  const isWrongNetwork = useSelector(
    (state: RootState) => state.wallet.isWrongNetwork
  );

  const [searchAddress, setSearchAddress] = useState("");
  const [claimableTokens, setClaimableTokens] = useState<ClaimableToken[]>([]);
  const [poolInfo, setPoolInfo] = useState<VmPoolInfo | null>(null);
  const [isCheckRewardLoading, setIsCheckRewardLoading] = useState(false);
  const [isClaimRewardLoading, setIsClaimRewardLoading] = useState(false);
  const [stakeAddress, setStakeAddress] = useState<string>("");
  const [numberOfSelectedTokens, setNumberOfSelectedTokens] = useState(0);

  useEffect(() => {
    setSearchAddress(isWrongNetwork ? "" : connectedWalletAddress);
  }, [connectedWalletAddress, isWrongNetwork]);

  useEffect(() => {
    setNumberOfSelectedTokens(
      claimableTokens.reduce((agg, i) => {
        if (i.selected) {
          agg += 1;
        }
        return agg;
      }, 0)
    );
  }, [claimableTokens]);

  const selectAllClaimableTokens = () => {
    const updatedClaimableTokens = [...claimableTokens];
    if (numberOfSelectedTokens < claimableTokens.length) {
      updatedClaimableTokens.forEach((token) => (token.selected = true));
    } else {
      updatedClaimableTokens.forEach((token) => (token.selected = false));
    }
    setClaimableTokens(updatedClaimableTokens);
  };

  const handleTokenSelect = (position: number) => {
    const updatedClaimableTokens = [...claimableTokens];
    updatedClaimableTokens[position].selected =
      !updatedClaimableTokens[position].selected;
    setClaimableTokens(updatedClaimableTokens);
  };

  const selectAll = () => {
    const updatedClaimableTokens = [...claimableTokens];
    if (numberOfSelectedTokens < claimableTokens.length) {
      updatedClaimableTokens.forEach((token) => (token.selected = true));
    } else {
      updatedClaimableTokens.forEach((token) => (token.selected = false));
    }
    setClaimableTokens(updatedClaimableTokens);
  };

  const checkRewards = async () => {
    setIsCheckRewardLoading(true);
    try {
      /**
       * check if the inserted address is cardano address, we want the stake address
       * if it is cardano address, get the staking address
       */
      let address = await getStakeKey(searchAddress);

      address = address.staking_address;

      setStakeAddress(address);
      const getRewardsDto = await getRewards(address);
      if (getRewardsDto == null) {
        throw new Error("Something went wrong when checking reward");
      }
      if (getRewardsDto.claimable_tokens.length !== 0) {
        setClaimableTokens(
          getRewardsDto.claimable_tokens
            .map((token) => {
              token.selected = false;
              return token;
            })
            .sort((a, b) => {
              if (a.premium === b.premium) {
                if (a.ticker < b.ticker) {
                  return -1;
                } else {
                  return 1;
                }
              } else {
                return a.premium ? -1 : 1;
              }
            })
        );
        setPoolInfo(getRewardsDto.pool_info);
        setIsCheckRewardLoading(false);
      } else {
        dispatch(
          showModal({
            modalType: ModalTypes.info,
            details: {
              text: "No rewards found for the account, yet.",
              type: InfoModalTypes.info,
            },
          })
        );
      }
    } catch (e: any) {
      handleError(e);
    } finally {
      setIsCheckRewardLoading(false);
    }
  };

  const claimRewards = async () => {
    if (numberOfSelectedTokens === 0) return;

    setIsClaimRewardLoading(true);
    let selectedPremiumToken = false;

    const selectedTokenId: string[] = [];
    claimableTokens.forEach((token) => {
      if (token.selected) {
        if (token.premium) {
          selectedPremiumToken = true;
        }
        selectedTokenId.push(token.assetId);
      }
    });

    try {
      const res = await getCustomRewards(
        stakeAddress,
        stakeAddress.slice(0, 40),
        selectedTokenId.join(","),
        selectedPremiumToken
      );
      if (res == null) throw new Error();

      let depositInfoUrl = `${PageRoute.depositCardano}?stakeAddress=${stakeAddress}&withdrawAddress=${res.withdrawal_address}&requestId=${res.request_id}&selectedTokens=${numberOfSelectedTokens}&unlock=${selectedPremiumToken}&isWhitelisted=${res.is_whitelisted}`;
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
    cancelClaim,
    claimableTokens,
    selectAllClaimableTokens,
    handleTokenSelect,
    numberOfSelectedTokens,
    isCheckRewardLoading,
    isClaimRewardLoading,
    poolInfo,
  };
}

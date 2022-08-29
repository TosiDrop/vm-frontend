import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, KeyboardEvent, useCallback } from "react";
import { ClaimableToken } from "../../entities/vm.entities";
import {
  getCustomRewards,
  getRewards,
  getStakeKey,
} from "../../services/claim.services";
import { ModalTypes, InfoModalTypes } from "../../entities/common.entities";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/store";
import { showModal } from "src/reducers/globalSlice";
import Spinner from "src/components/Spinner";
import ClaimableTokenBox from "./components/ClaimableTokenBox";
import { useNavigate } from "react-router-dom";

function Rewards() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const connectedWallet = useSelector(
    (state: RootState) => state.wallet.walletApi
  );

  const isWrongNetwork = useSelector(
    (state: RootState) => state.wallet.isWrongNetwork
  );
  const [hideCheck, setHideCheck] = useState(false);
  const [hideStakingInfo, setHideStakingInfo] = useState(true);

  const [claimableTokens, setClaimableTokens] = useState<ClaimableToken[]>([]);
  const [poolInfo, setPoolInfo] = useState<any>(null);
  const [numberOfSelectedTokens, setNumberOfSelectedTokens] = useState(0);

  const [searchAddress, setSearchAddress] = useState<string>("");
  const [rewardsLoader, setRewardsLoader] = useState(false);
  const [stakeAddress, setStakeAddress] = useState<string>("");
  const [claimMyRewardLoading, setClaimMyRewardLoading] =
    useState<boolean>(false);

  useEffect(() => {
    if (claimableTokens.length) {
      setHideStakingInfo(false);
    } else {
      setHideStakingInfo(true);
    }
  }, [claimableTokens]);

  useEffect(() => {
    async function init() {
      if (connectedWallet?.wallet?.api && !isWrongNetwork) {
        setSearchAddress(await connectedWallet.getAddress());
        setHideCheck(false);
        setHideStakingInfo(true);
      }
    }

    init();
  }, [connectedWallet?.wallet?.api, connectedWallet, isWrongNetwork]);

  const getNumberOfSelectedTokens = useCallback(() => {
    return claimableTokens.reduce((prev, token) => {
      if (token.selected) {
        prev += 1;
      }
      return prev;
    }, 0);
  }, [claimableTokens]);

  /**
   * select/unselect all tokens
   */
  const selectAll = () => {
    const updatedClaimableTokens = [...claimableTokens];
    if (numberOfSelectedTokens < claimableTokens.length) {
      updatedClaimableTokens.forEach((token) => (token.selected = true));
    } else {
      updatedClaimableTokens.forEach((token) => (token.selected = false));
    }
    setClaimableTokens(updatedClaimableTokens);
    setNumberOfSelectedTokens(getNumberOfSelectedTokens());
  };

  /**
   * handle token select
   */
  const handleTokenSelect = (position: number) => {
    const updatedClaimableTokens = [...claimableTokens];
    updatedClaimableTokens[position].selected =
      !updatedClaimableTokens[position].selected;
    setClaimableTokens(updatedClaimableTokens);
    setNumberOfSelectedTokens(getNumberOfSelectedTokens());
  };

  const checkRewards = async () => {
    if (searchAddress) {
      setRewardsLoader(true);
      try {
        /**
         * check if the inserted address is cardano address
         * we want the stake address
         * if it is cardano address, get the staking address
         */
        let address = await getStakeKey(searchAddress);

        address = address.staking_address;

        setStakeAddress(address);
        const getRewardsDto = await getRewards(address);
        if (getRewardsDto == null) throw new Error();
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
          setRewardsLoader(false);
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
          setRewardsLoader(false);
        }
      } catch (ex: any) {
        switch (true) {
          case ex?.response?.status === 404:
          default:
            dispatch(
              showModal({
                modalType: ModalTypes.info,
                details: {
                  text: "Account not found.",
                  type: InfoModalTypes.info,
                },
              })
            );
            setRewardsLoader(false);
        }
      }
    }
  };

  const claimMyRewards = async () => {
    if (numberOfSelectedTokens === 0) return;

    setClaimMyRewardLoading(true);
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

      let depositInfoUrl = `/claim/?stakeAddress=${stakeAddress}&withdrawAddress=${res.withdrawal_address}&requestId=${res.request_id}&selectedTokens=${numberOfSelectedTokens}&unlock=${selectedPremiumToken}&isWhitelisted=${res.is_whitelisted}`;
      navigate(depositInfoUrl, { replace: true });
    } catch (e) {
      dispatch(
        showModal({
          modalType: ModalTypes.info,
          details: {
            text: "Something went wrong. Please try again later.",
            type: InfoModalTypes.failure,
          },
        })
      );
      setClaimMyRewardLoading(false);
      return;
    }
  };

  const cancelClaim = async () => {
    setClaimableTokens([]);
  };

  const renderStakeInfo = () => {
    if (poolInfo != null) {
      return (
        <>
          {poolInfo.delegated_pool_logo ? (
            <img
              className="h-5 mr-2.5"
              src={poolInfo.delegated_pool_logo}
              alt=""
            />
          ) : (
            ""
          )}
          <div className="pool-info">
            <div className="staking-info">
              Currently staking&nbsp;
              <strong>{poolInfo.total_balance} ADA</strong>
              &nbsp;with&nbsp;
              <strong className="no-break">
                [{poolInfo.delegated_pool_name}
                ]&nbsp;
                {poolInfo.delegated_pool_description}
              </strong>
              <strong className="no-break-mobile">
                [{poolInfo.delegated_pool_name}]
              </strong>
            </div>
          </div>
        </>
      );
    } else {
      return <>Unregistered</>;
    }
  };

  function renderCheckRewardsStep() {
    if (!hideCheck) {
      return (
        <div className="mt-5 p-5 background text rounded-2xl">
          <p>Enter your wallet/stake address or $handle to view your rewards</p>
          <input
            className={`mt-5 w-full rounded-lg bg-transparent border-gray-400 border p-1 disabled:cursor-not-allowed`}
            type="text"
            value={searchAddress}
            onInput={(e: KeyboardEvent<HTMLInputElement>) =>
              setSearchAddress((e.target as HTMLInputElement).value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                checkRewards();
              }
            }}
            disabled={
              !hideStakingInfo ||
              (typeof connectedWallet?.wallet?.api !== "undefined" &&
                !isWrongNetwork)
            }
          ></input>
          <div className="mt-5 flex flex-row items-center">
            <button
              className="tosi-button py-2.5 px-5 rounded-lg flex flex-row items-center"
              disabled={!hideStakingInfo}
              onClick={checkRewards}
            >
              Check my rewards
              {rewardsLoader ? (
                <div className="ml-2.5">
                  <Spinner></Spinner>
                </div>
              ) : null}
            </button>
            <button
              className={
                "tosi-button py-2.5 px-5 rounded-lg ml-5" +
                (hideStakingInfo ? " hidden" : "")
              }
              onClick={cancelClaim}
            >
              <div className="tosi-cancel-text">Cancel</div>
            </button>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  function renderStakingInfoStep() {
    if (!hideStakingInfo) {
      return (
        <div className="">
          <div
            className={
              "background rounded-2xl p-5 mt-5 flex flex-row items-center"
            }
          >
            {renderStakeInfo()}
          </div>
          <div
            className={
              "background rounded-2xl p-5 mt-5 flex flex-row items-center"
            }
          >
            <div className="text-premium mr-2.5">
              <FontAwesomeIcon icon={faStar} />
            </div>
            Premium tokens incur a premium token fee when claiming
          </div>
          <div className={"flex flex-row flex-wrap"}>
            {claimableTokens.map((token, index) => {
              return (
                <ClaimableTokenBox
                  key={index}
                  index={index}
                  ticker={token.ticker}
                  selected={token.selected || false}
                  handleOnChange={handleTokenSelect}
                  amount={token.amount}
                  decimals={token.decimals}
                  logo={token.logo}
                  assetId={token.assetId}
                  premium={token.premium}
                />
              );
            })}
          </div>

          <div
            className={
              "background flex flex-row items-center p-5 mt-5 rounded-2xl"
            }
          >
            <div>Selected {numberOfSelectedTokens} token</div>
            <div className="ml-auto flex flex-row w-fit">
              <button
                className="tosi-button py-2.5 px-5 rounded-lg"
                onClick={selectAll}
              >
                {numberOfSelectedTokens === claimableTokens.length
                  ? "Unselect All"
                  : "Select All"}
              </button>
              <button
                className="tosi-button ml-5 py-2.5 px-5 rounded-lg flex flex-row items-center"
                disabled={numberOfSelectedTokens === 0}
                onClick={claimMyRewards}
              >
                Claim my rewards
                {claimMyRewardLoading ? (
                  <div className="ml-2.5">
                    <Spinner></Spinner>
                  </div>
                ) : null}
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  return (
    <div className="px-5 py-14 sm:pl-80 sm:pr-20">
      <p className="text-3xl">Claim your rewards</p>
      {renderCheckRewardsStep()}
      {renderStakingInfoStep()}
    </div>
  );
}

export default Rewards;

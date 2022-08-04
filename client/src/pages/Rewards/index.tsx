import { faXmark, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, KeyboardEvent } from "react";
import { GetRewards } from "../../entities/vm.entities";
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
    const [rewards, setRewards] = useState<GetRewards | undefined>();
    const [searchAddress, setSearchAddress] = useState<string>("");
    const [rewardsLoader, setRewardsLoader] = useState(false);
    const [checkedState, setCheckedState] = useState(new Array<boolean>());
    const [checkedCount, setCheckedCount] = useState(0);
    const [allIsSelected, setAllIsSelected] = useState<boolean>(false);
    const [stakeAddress, setStakeAddress] = useState<string>("");
    const [claimMyRewardLoading, setClaimMyRewardLoading] =
        useState<boolean>(false);

    /**
     * check if every token is selected
     */
    useEffect(() => {
        setAllIsSelected(checkedState.every((i) => i));
    }, [checkedState]);

    useEffect(() => {
        if (rewards?.claimable_tokens.length) {
            setCheckedState(
                new Array(rewards.claimable_tokens.length).fill(false)
            );
            setHideStakingInfo(false);
        } else {
            setCheckedState([]);
            setHideStakingInfo(true);
        }
    }, [rewards?.claimable_tokens]);

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

    /**
     * select/unselect all tokens
     */
    const selectAll = () => {
        let updatedCheckedState;
        if (allIsSelected) {
            updatedCheckedState = checkedState.map(() => false);
        } else {
            updatedCheckedState = checkedState.map(() => true);
        }

        setCheckedState(updatedCheckedState);
        const updatedCheckedCount = updatedCheckedState.filter(
            (check) => check
        ).length;
        setCheckedCount(updatedCheckedCount);
    };

    /**
     * handle token select
     */
    const handleTokenSelect = (position: number) => {
        const updatedCheckedState = checkedState.map((item, index) =>
            index === position ? !item : item
        );

        setCheckedState(updatedCheckedState);
        const updatedCheckedCount = updatedCheckedState.filter(
            (check) => check
        ).length;
        setCheckedCount(updatedCheckedCount);
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
                const rewards = await getRewards(address);

                if (rewards && Object.keys(rewards.claimable_tokens).length) {
                    setRewards(rewards);
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
        let selectedPremiumToken = false;

        if (checkedCount === 0) return;
        if (rewards == null) return;

        /**
         * get tx info for custom withdrawal
         */
        if (rewards == null) return;

        setClaimMyRewardLoading(true);

        const selectedTokenId = [];
        const availableRewards = rewards.claimable_tokens;
        for (let i = 0; i < checkedState.length; i++) {
            if (checkedState[i]) {
                if (availableRewards[i].premium) {
                    selectedPremiumToken = true;
                }
                selectedTokenId.push(availableRewards[i].assetId);
            }
        }
        try {
            const res = await getCustomRewards(
                stakeAddress,
                stakeAddress.slice(0, 40),
                selectedTokenId.join(","),
                selectedPremiumToken
            );
            if (res == null) throw new Error();

            let depositInfoUrl = `/claim/?stakeAddress=${stakeAddress}&withdrawAddress=${res.withdrawal_address}&requestId=${res.request_id}&selectedTokens=${checkedCount}&unlock=${selectedPremiumToken}`;
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
        setRewards(undefined);
        setSearchAddress("");
    };

    const renderStakeInfo = () => {
        if (rewards?.pool_info) {
            return (
                <>
                    {rewards?.pool_info?.delegated_pool_logo ? (
                        <img
                            className="h-5 mr-2.5"
                            src={rewards?.pool_info?.delegated_pool_logo}
                            alt=""
                        />
                    ) : (
                        ""
                    )}
                    <div className="pool-info">
                        <div className="staking-info">
                            Currently staking&nbsp;
                            <strong>
                                {rewards?.pool_info?.total_balance} ADA
                            </strong>
                            &nbsp;with&nbsp;
                            <strong className="no-break">
                                [{rewards?.pool_info?.delegated_pool_name}
                                ]&nbsp;
                                {rewards?.pool_info?.delegated_pool_description}
                            </strong>
                            <strong className="no-break-mobile">
                                [{rewards?.pool_info?.delegated_pool_name}]
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
                    <p>
                        Enter your wallet/stake address or $handle to view your
                        rewards
                    </p>
                    <input
                        className={`mt-5 w-full rounded-lg bg-transparent border-gray-400 border p-1 disabled:cursor-not-allowed`}
                        type="text"
                        value={searchAddress}
                        onInput={(e: KeyboardEvent<HTMLInputElement>) =>
                            setSearchAddress(
                                (e.target as HTMLInputElement).value
                            )
                        }
                        disabled={
                            !hideStakingInfo ||
                            (typeof connectedWallet?.wallet?.api !==
                                "undefined" &&
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
                        {rewards?.claimable_tokens
                            ?.sort((a, b) => (a.premium ? -1 : 1))
                            .map((token, index) => {
                                return (
                                    <ClaimableTokenBox
                                        key={index}
                                        index={index}
                                        ticker={token.ticker}
                                        checked={checkedState[index]}
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
                        <div>Selected {checkedCount} token</div>
                        <div className="ml-auto flex flex-row w-fit">
                            <button
                                className="tosi-button py-2.5 px-5 rounded-lg"
                                onClick={selectAll}
                            >
                                {allIsSelected ? "Unselect All" : "Select All"}
                            </button>
                            <button
                                className="tosi-button ml-5 py-2.5 px-5 rounded-lg flex flex-row items-center"
                                disabled={checkedCount === 0}
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

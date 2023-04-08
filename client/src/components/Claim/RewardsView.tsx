import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ClaimableTokenBox from "src/components/Claim/ClaimableTokenBox";
import Spinner from "src/components/Spinner";
import { ClaimableToken } from "src/entities/vm.entities";

interface Props {
  claimableTokens: ClaimableToken[];
  handleTokenSelect: (_: number) => void;
  numberOfSelectedTokens: number;
  claimRewards: () => void;
  isLoadingClaimReward: boolean;
  selectAll: () => void;
  poolInfo?: any;
  maxTokenSelected: number;
  selectRandomTokens: any;
}

export default function RewardsView({
  claimableTokens,
  handleTokenSelect,
  numberOfSelectedTokens,
  claimRewards,
  isLoadingClaimReward,
  selectAll,
  poolInfo,
  maxTokenSelected,
  selectRandomTokens,
}: Props) {
  if (claimableTokens.length > 0) {
    return (
      <div className="flex flex-col gap-4">
        <div
          className={"background rounded-2xl p-5 flex flex-row items-center"}
        >
          {poolInfo != null ? (
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
                    {poolInfo.delegated_pool_name}
                    &nbsp; [{poolInfo.delegated_pool_ticker}]
                  </strong>
                </div>
              </div>
            </>
          ) : (
            <>Unregistered</>
          )}
        </div>
        <div
          className={
            "background rounded-2xl p-5 flex flex-row items-center gap-2"
          }
        >
          <div className="text-premium">
            <FontAwesomeIcon icon={faStar} />
          </div>
          {poolInfo?.isWhitelisted
            ? "No TosiFee on claims because you have staked to a TosiDrop core pool"
            : "These tokens incur a TosiFee when claiming"}
        </div>
        <div className={"flex flex-row flex-wrap gap-4"}>
          {claimableTokens.map((token, index) => {
            return (
              <ClaimableTokenBox
                key={index}
                index={index}
                ticker={token.ticker}
                price={token.price ?? "N/A"}
                total={token.total ?? "N/A"}
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
          className={"background flex flex-row items-center p-5 rounded-2xl"}
        >
          <div>Selected {numberOfSelectedTokens} token</div>
          <div className="ml-auto flex flex-row w-fit gap-4">
            <button
              className="tosi-button py-2.5 px-5 rounded-lg"
              onClick={selectAll}
            >
              Unselect All
            </button>

            <button
              className="tosi-button py-2.5 px-5 rounded-lg"
              onClick={selectRandomTokens}
            >
              I'm feeling lucky
            </button>

            <button
              className="tosi-button py-2.5 px-5 rounded-lg flex flex-row items-center"
              disabled={numberOfSelectedTokens === 0}
              onClick={claimRewards}
            >
              Claim my rewards
              {isLoadingClaimReward ? (
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

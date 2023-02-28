import { KeyboardEvent } from "react";
import Spinner from "src/components/Spinner";

interface Props {
  searchAddress: string;
  setSearchAddress: (_: string) => void;
  checkRewards: () => void;
  isSearchDisabledAndStakingInfoShown: boolean;
  isRewardLoading: boolean;
  cancelClaim: () => void;
}

export default function CheckRewardInput({
  searchAddress,
  setSearchAddress,
  checkRewards,
  isSearchDisabledAndStakingInfoShown,
  isRewardLoading,
  cancelClaim,
}: Props) {
  function handleCheckReward(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      checkRewards();
    }
  }

  function handleInput(e: KeyboardEvent<HTMLInputElement>) {
    setSearchAddress((e.target as HTMLInputElement).value);
  }

  return (
    <div className="p-5 background text rounded-2xl flex flex-col gap-4">
      <p>Enter your wallet/stake address or $handle to view your rewards</p>
      <input
        className={`w-full rounded-lg bg-transparent border-gray-400 border p-1 disabled:cursor-not-allowed`}
        value={searchAddress}
        onInput={handleInput}
        onKeyDown={handleCheckReward}
        disabled={!isSearchDisabledAndStakingInfoShown}
      ></input>
      <div className="flex flex-row items-center">
        <button
          className="tosi-button py-2.5 px-5 rounded-lg flex flex-row items-center"
          disabled={!isSearchDisabledAndStakingInfoShown}
          onClick={checkRewards}
        >
          Check my rewards
          {isRewardLoading ? (
            <div className="ml-2.5">
              <Spinner></Spinner>
            </div>
          ) : null}
        </button>
        <button
          className={`tosi-button py-2.5 px-5 rounded-lg ml-5 ${
            isSearchDisabledAndStakingInfoShown ? " hidden" : ""
          }`}
          onClick={cancelClaim}
        >
          <div className="tosi-cancel-text">Cancel</div>
        </button>
      </div>
    </div>
  );
}

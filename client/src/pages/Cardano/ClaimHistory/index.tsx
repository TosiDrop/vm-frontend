import { KeyboardEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import HistoryTable from "src/components/HistoryTable";
import Spinner from "src/components/Spinner";
import useClaimHistory from "src/hooks/cardano/claimHistory/useClaimHistory";
import { RootState } from "src/store";

function ClaimHistory() {
  const connectedWalletAddress = useSelector(
    (state: RootState) => state.wallet.walletAddress
  );
  const isWrongNetwork = useSelector(
    (state: RootState) => state.wallet.isWrongNetwork
  );
  const { claimHistory, loading, checkClaimHistory } = useClaimHistory();
  const [searchAddress, setSearchAddress] = useState<string>("");

  useEffect(() => {
    setSearchAddress(isWrongNetwork ? "" : connectedWalletAddress);
  }, [connectedWalletAddress, isWrongNetwork]);

  return (
    <>
      <p className="text-3xl">History</p>
      <div className="flex flex-col gap-4">
        <div className="p-5 background text rounded-2xl flex flex-col gap-4">
          <p>
            Enter your wallet/stake address or $handle to view your reward
            history
          </p>
          <input
            className={`w-full rounded-lg bg-transparent border-gray-400 border p-1 disabled:cursor-not-allowed`}
            type="text"
            value={searchAddress}
            onInput={(e: KeyboardEvent<HTMLInputElement>) =>
              setSearchAddress((e.target as HTMLInputElement).value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                checkClaimHistory(searchAddress);
              }
            }}
            disabled={loading}
          ></input>
          <div className="flex flex-row items-center">
            <button
              className="tosi-button py-2.5 px-5 rounded-lg flex flex-row items-center"
              disabled={loading}
              onClick={() => checkClaimHistory(searchAddress)}
            >
              View my history
              {loading ? (
                <div className="ml-2.5">
                  <Spinner></Spinner>
                </div>
              ) : null}
            </button>
          </div>
        </div>
        <HistoryTable claimHistory={claimHistory}></HistoryTable>
      </div>
    </>
  );
}

export default ClaimHistory;

import { KeyboardEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Spinner from "src/components/Spinner";
import { InfoModalTypes, ModalTypes } from "src/entities/common.entities";
import { GetRewardsHistory } from "src/entities/vm.entities";
import { showModal } from "src/reducers/globalSlice";
import { getDeliveredRewards } from "src/services/claim";
import { getStakeKey } from "src/services/common";
import { RootState } from "src/store";

import useErrorHandler from "src/hooks/useErrorHandler";

function ClaimHistory() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const connectedWallet = useSelector(
    (state: RootState) => state.wallet.walletApi
  );
  const { handleError } = useErrorHandler();

  const isWrongNetwork = useSelector(
    (state: RootState) => state.wallet.isWrongNetwork
  );
  const [hideCheck, setHideCheck] = useState(false);
  const [hideHistory, setHideHistory] = useState(true);

  const [claimHistory, setClaimHisory] = useState<GetRewardsHistory[]>([]);
  const [loader, setLoader] = useState(false);

  const [searchAddress, setSearchAddress] = useState<string>("");
  const [stakeAddress, setStakeAddress] = useState<string>("");

  useEffect(() => {
    if (claimHistory.length) {
      setHideHistory(false);
    } else {
      setHideHistory(true);
    }
  }, [claimHistory]);

  useEffect(() => {
    async function init() {
      if (connectedWallet?.wallet?.api && !isWrongNetwork) {
        setSearchAddress(await connectedWallet.getAddress());
        setHideCheck(false);
        setHideHistory(true);
      }
    }

    init();
  }, [connectedWallet?.wallet?.api, connectedWallet, isWrongNetwork]);

  const checkRewardHistory = async () => {
    if (searchAddress) {
      setLoader(true);
      try {
        let address = await getStakeKey(searchAddress);
        setStakeAddress(address);

        const getRewardsHistory = await getDeliveredRewards(stakeAddress);
        if (getRewardsHistory == null) throw new Error();
        if (getRewardsHistory.length !== 0) {
          setClaimHisory(getRewardsHistory);
          setLoader(false);
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
      } catch (e: any) {
        handleError(e);
      } finally {
        setLoader(false);
      }
    }
  };

  function renderCheckRewardHistoryStep() {
    if (!hideCheck) {
      return (
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
                checkRewardHistory();
              }
            }}
            disabled={
              loader ||
              (typeof connectedWallet?.wallet?.api !== "undefined" &&
                !isWrongNetwork)
            }
          ></input>
          <div className="flex flex-row items-center">
            <button
              className="tosi-button py-2.5 px-5 rounded-lg flex flex-row items-center"
              disabled={loader}
              onClick={checkRewardHistory}
            >
              View my history
              {loader ? (
                <div className="ml-2.5">
                  <Spinner></Spinner>
                </div>
              ) : null}
            </button>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  function renderHistory() {
    if (!hideHistory) {
      return (
        <table className="background rounded-2xl p-5 table-fixed border-separate text-left">
          <thead className="border-b">{renderHistoryHeader()}</thead>
          <tbody className="align-top">
            {claimHistory.map((tx) => renderHistoryElement(tx))}
          </tbody>
        </table>
      );
    } else {
      return null;
    }
  }

  function renderHistoryHeader() {
    return (
      <tr>
        <th className="w-2/12">Date/Time</th>
        <th className="w-8/12">Token</th>
        <th className="w-1/12">Amount</th>
      </tr>
    );
  }

  function renderHistoryElement(tx: GetRewardsHistory) {
    // Our server returns dates GMT+2. Ideally it would just return the UTC timestamp integer.
    var date = new Date(tx.delivered_on + "+0200");
    return (
      <tr>
        <td>
          <div>
            {date.toLocaleDateString() + " " + date.toLocaleTimeString()}
          </div>
        </td>
        <td className="break-all">{tx.token}</td>
        <td className="break-all">{tx.amount}</td>
      </tr>
    );
  }

  return (
    <>
      <p className="text-3xl">History</p>
      <div className="flex flex-col gap-4">
        {renderCheckRewardHistoryStep()}
        {renderHistory()}
      </div>
    </>
  );
}

export default ClaimHistory;

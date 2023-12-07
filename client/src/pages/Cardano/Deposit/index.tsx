/**
 * URL example: http://localhost:3001/claim/?stakeAddress=stake_test1uzp4rhnuegqrqrnvg24e22fgjdnrln9533p2s4x20y7kjxc8kur62&withdrawAddress=addr_test1qp74nfv3syq939xu6cy4q3qh0r0aftj0lgep45vx4jdnuvy8qjkhrfpyngv405v225v2n2hntlgl95rx8yjwd4vaatxqxgy762&requestId=125&selectedTokens=1
 */

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import DepositInfo from "src/components/Claim/DepositInfo";
import { GetCustomRewards } from "src/entities/vm.entities";
import { useQueue } from "src/hooks/cardano/claim/useQueue";
import Loading from "src/pages/Loading";
import { getTxStatus } from "src/services/claim";

interface TransactionStatus {
  expected_deposit: number;
  deposit: number;
  status: number;
}

enum QueryKey {
  selectedTokens = "selectedTokens",
  stakeAddress = "stakeAddress",
  withdrawAddress = "withdrawAddress",
  requestId = "requestId",
  isWhitelisted = "isWhitelisted",
  unlock = "unlock",
  native = "native",
}

export enum TransactionStatusDetail {
  waiting = 0,
  processing = 1,
  failure = 2,
  success = 3,
}

const DepositInfoPage = () => {
  /**
   * parse query parameters from URL
   */
  const [searchParams] = useSearchParams();
  const queue = useQueue();
  const selectedTokens = searchParams.get(QueryKey.selectedTokens);
  const stakeAddress = searchParams.get(QueryKey.stakeAddress);
  const withdrawAddress = searchParams.get(QueryKey.withdrawAddress);
  const requestId = searchParams.get(QueryKey.requestId);
  const isWhitelisted =
    searchParams.get(QueryKey.isWhitelisted) === "true" ? true : false;
  const unlock = searchParams.get(QueryKey.unlock) === "true" ? true : false;
  const native = searchParams.get(QueryKey.native) === "true" ? true : false;

  const [txDetail, setTxDetail] = useState<GetCustomRewards>({
    deposit: 0,
    withdrawal_address: withdrawAddress ?? "",
    request_id: requestId ?? "",
    is_whitelisted: isWhitelisted ?? false,
  });
  const checkedCount = selectedTokens ? Number(selectedTokens) : 0;
  const [loading, setLoading] = useState(true);
  const [transactionStatus, setTransactionStatus] =
    useState<TransactionStatusDetail>(TransactionStatusDetail.waiting);
  const [transactionId, setTransactionId] = useState<string>("");

  useEffect(() => {
    const loadTxDetail = async () => {
      /**
       * check if all info is there
       */
      if (!requestId || !stakeAddress || !withdrawAddress) return;

      /**
       * get the tx status
       */
      const txStatus: TransactionStatus = await getTxStatus(
        requestId,
        stakeAddress.slice(0, 40),
      );

      /**
       * set result to state
       */
      setTxDetail({
        deposit: txStatus.expected_deposit,
        withdrawal_address: withdrawAddress,
        request_id: requestId,
        is_whitelisted: isWhitelisted,
      });

      const status = txStatus.status;
      switch (status) {
        case TransactionStatusDetail.failure:
        case TransactionStatusDetail.success:
          setTransactionStatus(status);
          clearInterval(checkTxStatusInterval);
          break;
        case TransactionStatusDetail.processing:
          setTransactionStatus(status);
          break;
        case TransactionStatusDetail.waiting:
        default:
          break;
      }

      /**
       * if status is retrieved, stop loading
       */
      setLoading(false);
    };

    /**
     * load status every 60s
     */
    loadTxDetail();
    const checkTxStatusInterval = setInterval(loadTxDetail, 60000);

    return () => {
      clearInterval(checkTxStatusInterval);
    };
  }, [requestId, stakeAddress, withdrawAddress, isWhitelisted]);

  return loading ? (
    <Loading />
  ) : selectedTokens && stakeAddress && withdrawAddress && requestId ? (
    <>
      <p className="text-3xl flex items-center gap-2">
        Claim your rewards
        <div className="background rounded-lg w-fit text-sm h-full flex items-center justify-center px-2.5">
          Queue: {queue}
        </div>
      </p>
      <DepositInfo
        txDetail={txDetail}
        checkedCount={checkedCount}
        transactionId={transactionId}
        transactionStatus={transactionStatus}
        setTransactionId={setTransactionId}
        setTransactionStatus={setTransactionStatus}
        unlock={unlock}
        native={native}
      ></DepositInfo>
    </>
  ) : null;
};

export default DepositInfoPage;

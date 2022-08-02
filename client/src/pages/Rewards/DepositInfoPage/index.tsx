/**
 * URL example: http://localhost:3001/claim/?stakeAddress=stake_test1uzp4rhnuegqrqrnvg24e22fgjdnrln9533p2s4x20y7kjxc8kur62&withdrawAddress=addr_test1qp74nfv3syq939xu6cy4q3qh0r0aftj0lgep45vx4jdnuvy8qjkhrfpyngv405v225v2n2hntlgl95rx8yjwd4vaatxqxgy762&requestId=125&selectedTokens=1
 */

import { useSearchParams } from "react-router-dom";
import { getTxStatus } from "src/services/claim.services";
import { GetCustomRewards } from "src/entities/vm.entities";
import { useEffect, useState } from "react";
import DepositInfo from "../components/DepositInfo";
import Loading from "src/pages/Loading";

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
    unlock = "unlock",
}

export enum TransactionStatusDetail {
    waiting = 0,
    processing = 1,
    failure = 2,
    success = 3,
}

const DepositInfoPage = () => {
    const [searchParams] = useSearchParams();
    const selectedTokens = searchParams.get(QueryKey.selectedTokens);
    const stakeAddress = searchParams.get(QueryKey.stakeAddress);
    const withdrawAddress = searchParams.get(QueryKey.withdrawAddress);
    const requestId = searchParams.get(QueryKey.requestId);
    let unlock: boolean;
    if (searchParams.get(QueryKey.unlock) === "true") unlock = true;
    else unlock = false;

    const [txDetail, setTxDetail] = useState<GetCustomRewards>({
        deposit: 0,
        withdrawal_address: withdrawAddress ? withdrawAddress : "",
        request_id: requestId ? requestId : "",
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
                stakeAddress.slice(0, 40)
            );

            /**
             * set result to state
             */
            setTxDetail({
                deposit: txStatus.expected_deposit,
                withdrawal_address: withdrawAddress,
                request_id: requestId,
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
         * load status every 30s
         */
        loadTxDetail();
        const checkTxStatusInterval = setInterval(loadTxDetail, 30000);

        return () => {
            clearInterval(checkTxStatusInterval);
        };
    }, [requestId, stakeAddress, withdrawAddress]);

    return loading ? (
        <Loading />
    ) : selectedTokens && stakeAddress && withdrawAddress && requestId ? (
        <div className="rewards">
            <h1>Claim your rewards</h1>
            <DepositInfo
                txDetail={txDetail}
                checkedCount={checkedCount}
                transactionId={transactionId}
                transactionStatus={transactionStatus}
                setTransactionId={setTransactionId}
                setTransactionStatus={setTransactionStatus}
                unlock={unlock}
            ></DepositInfo>
        </div>
    ) : null;
};

export default DepositInfoPage;

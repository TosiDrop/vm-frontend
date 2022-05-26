/**
 * URL example: http://localhost:3001/claim/?stakeAddress=stake_test1uzp4rhnuegqrqrnvg24e22fgjdnrln9533p2s4x20y7kjxc8kur62&withdrawAddress=addr_test1qp74nfv3syq939xu6cy4q3qh0r0aftj0lgep45vx4jdnuvy8qjkhrfpyngv405v225v2n2hntlgl95rx8yjwd4vaatxqxgy762&requestId=125&selectedTokens=1
 */

import { useSearchParams } from "react-router-dom";
import { getTxStatus } from "src/services/http.services";
import WalletApi from "src/services/connectors/wallet.connector";
import { GetCustomRewards } from "src/entities/vm.entities";
import { useEffect, useState } from "react";
import DepositInfo from "../components/DepositInfo";
import "../index.scss";

interface TransactionStatus {
    expected_deposit: number;
    deposit: number;
}

interface Params {
    wrongNetwork: boolean | undefined;
    connectedWallet: WalletApi | undefined;
}

enum QueryKey {
    selectedTokens = "selectedTokens",
    stakeAddress = "stakeAddress",
    withdrawAddress = "withdrawAddress",
    requestId = "requestId",
}

const DepositInfoPage = ({ wrongNetwork, connectedWallet }: Params) => {
    const [searchParams] = useSearchParams();
    const selectedTokens = searchParams.get(QueryKey.selectedTokens);
    const stakeAddress = searchParams.get(QueryKey.stakeAddress);
    const withdrawAddress = searchParams.get(QueryKey.withdrawAddress);
    const requestId = searchParams.get(QueryKey.requestId);

    const [txDetail, setTxDetail] = useState<GetCustomRewards>({
        deposit: 0,
        withdrawal_address: withdrawAddress ? withdrawAddress : "",
        request_id: requestId ? requestId : "",
    });
    const checkedCount = selectedTokens ? Number(selectedTokens) : 0;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadTxDetail = async () => {
            if (!requestId || !stakeAddress || !withdrawAddress) return;
            const txStatus: TransactionStatus = await getTxStatus(
                requestId,
                stakeAddress.slice(0, 40)
            );

            setTxDetail({
                deposit: txStatus.expected_deposit,
                withdrawal_address: withdrawAddress,
                request_id: requestId,
            });
            setLoading(false);
        };
        loadTxDetail();
    }, [requestId, stakeAddress, withdrawAddress]);

    return loading ? null : selectedTokens &&
      stakeAddress &&
      withdrawAddress &&
      requestId ? (
        <div className="rewards">
            <h1>Claim your rewards</h1>
            <DepositInfo
                txDetail={txDetail}
                checkedCount={checkedCount}
                connectedWallet={connectedWallet}
                wrongNetwork={wrongNetwork}
                stakeAddress={stakeAddress}
            ></DepositInfo>
        </div>
    ) : null;
};

export default DepositInfoPage;

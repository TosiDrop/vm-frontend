import { useParams } from "react-router-dom";
import { getTxStatus } from "src/services/http.services";
import WalletApi from "src/services/connectors/wallet.connector";
import { RootState } from "src/store";
import { GetRewards, GetCustomRewards } from "src/entities/vm.entities";
import { getCustomRewards, getRewards } from "src/services/http.services";
import { useEffect, useState } from "react";
import DepositInfo from "../components/DepositInfo";
import "./index.scss";

interface TransactionStatus {
    expected_deposit: number;
    deposit: number;
}

interface Params {
    wrongNetwork: boolean | undefined;
    connectedWallet: WalletApi | undefined;
}

const DepositInfoPage = ({ wrongNetwork, connectedWallet }: Params) => {
    const { selectedTokens, stakeAddress, withdrawAddress, requestId } =
        useParams();
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
    }, []);

    return loading ? null : (
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
    );
};

export default DepositInfoPage;

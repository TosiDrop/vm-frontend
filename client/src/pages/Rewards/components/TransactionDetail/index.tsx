import { formatTokens } from "src/services/utils.services";
import "./index.scss";

const CLASS = "transaction-detail";

interface Props {
    numberOfTokens: number;
    withdrawalFee: number;
    deposit: number;
}

const TransactionDetail = ({
    numberOfTokens,
    withdrawalFee,
    deposit,
}: Props) => {
    return (
        <div className={`rewards-block ${CLASS}`}>
            <div className={`${CLASS}__title`}>Transaction Detail</div>
            <div className={`${CLASS}__row`}>
                <div>{numberOfTokens} tokens</div>
                <div>Total tokens selected</div>
            </div>
            <div className={`${CLASS}__row`}>
                <div>{formatTokens(withdrawalFee.toString(), 6, 1)} ADA</div>
                <div>Withdrawal Fee</div>
            </div>
            <div className={`${CLASS}__row`}>
                <div>0.17 ADA</div>
                <div>Transaction Fee</div>
            </div>
            <div className={`${CLASS}__row`}>
                <div>0.1 ADA</div>
                <div>Service Fee</div>
            </div>
            <div className={`${CLASS}__row`}>
                <div>{formatTokens(deposit.toString(), 6, 1)} ADA</div>
                <div>You Send</div>
            </div>
            <div className={`${CLASS}__row`}>
                <div>
                    ~
                    {formatTokens(
                        (deposit - 170000 - 100000 - withdrawalFee).toString(),
                        6,
                        1
                    )}{" "}
                    ADA
                </div>
                <div>You'll get back (Approximately)</div>
            </div>
            <div className={`${CLASS}__row ${CLASS}__warning`}>
                <div>
                    The withdrawal fee is just an approximation, but it won't
                    differ so much from the displayed value.
                </div>
            </div>
        </div>
    );
};

export default TransactionDetail;

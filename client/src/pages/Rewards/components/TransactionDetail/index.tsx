import { useEffect, useState } from "react";
import { getSettings } from "src/services/claim.services";
import "./index.scss";

const CLASS = "transaction-detail";

interface Props {
    numberOfTokens: number;
    deposit: number;
}

interface ISettings {
    withdrawalFee: number;
    serviceFee: number;
    txFee: number;
}

const TransactionDetail = ({ numberOfTokens, deposit }: Props) => {
    const [settings, setSettings] = useState<ISettings>({
        withdrawalFee: 0,
        serviceFee: 100000,
        txFee: 170000,
    });

    useEffect(() => {
        const getSettingsFromApi = async () => {
            const settingsFromApi = await getSettings();
            setSettings({
                ...settings,
                withdrawalFee: settingsFromApi.withdrawal_fee,
            });
        };
        getSettingsFromApi();
    }, [settings]);

    return (
        <div className={`rewards-block ${CLASS}`}>
            <div className={`${CLASS}__title`}>Transaction Detail</div>
            <div className={`${CLASS}__row`}>
                <div>{numberOfTokens} tokens</div>
                <div>Total tokens selected</div>
            </div>
            <div className={`${CLASS}__row`}>
                <div>{lovelaceToAda(settings.withdrawalFee)} ADA</div>
                <div>Withdrawal Fee</div>
            </div>
            <div className={`${CLASS}__row`}>
                <div>{lovelaceToAda(settings.txFee)} ADA</div>
                <div>Transaction Fee</div>
            </div>
            <div className={`${CLASS}__row`}>
                <div>{lovelaceToAda(settings.serviceFee)} ADA</div>
                <div>Service Fee</div>
            </div>
            <div className={`${CLASS}__row`}>
                <div>{lovelaceToAda(deposit)} ADA</div>
                <div>You Send</div>
            </div>
            <div className={`${CLASS}__row`}>
                <div>
                    {lovelaceToAda(
                        deposit -
                            settings.withdrawalFee -
                            settings.serviceFee -
                            settings.txFee
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

const lovelaceToAda = (lovelace: number) => {
    return lovelace / Math.pow(10, 6);
};

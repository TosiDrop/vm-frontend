import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { getFeatures, getSettings } from "src/services/claim.services";
import "./index.scss";

const CLASS = "transaction-detail";

interface Props {
    numberOfTokens: number;
    deposit: number;
    unlock: boolean;
}

interface ISettings {
    withdrawalFee: number;
    serviceFee: number;
    txFee: number;
    tosifee: number;
}

const TransactionDetail = ({ numberOfTokens, deposit, unlock }: Props) => {
    const [settings, setSettings] = useState<ISettings>({
        withdrawalFee: 0,
        serviceFee: 100000,
        txFee: 170000,
        tosifee: 500000,
    });

    useEffect(() => {
        const getSettingsFromApi = async () => {
            const settingsFromVM = await getSettings();
            const settingsFromFeatures = await getFeatures();
            setSettings({
                ...settings,
                tosifee: settingsFromFeatures.tosi_fee,
                withdrawalFee: settingsFromVM.withdrawal_fee,
            });
        };
        getSettingsFromApi();
    }, []);

    return (
        <div className={`rewards-block ${CLASS}`}>
            <div className={`${CLASS}__title`}>Transaction Detail</div>
            <div className={`${CLASS}__row`}>
                <div>{numberOfTokens} tokens</div>
                <div>Total tokens selected</div>
            </div>
            <div className={`${CLASS}__row`}>
                <div>{lovelaceToAda(settings.withdrawalFee)} ADA</div>
                <div>Withdrawal fee</div>
            </div>
            <div className={`${CLASS}__row`}>
                <div>{lovelaceToAda(settings.txFee)} ADA</div>
                <div>Transaction fee</div>
            </div>
            <div className={`${CLASS}__row`}>
                <div>{lovelaceToAda(settings.serviceFee)} ADA</div>
                <div>Service fee</div>
            </div>
            {unlock ? (
                <div className={`${CLASS}__row premium`}>
                    <div>{lovelaceToAda(settings.tosifee)} ADA</div>
                    <div className="tooltip-activator">
                        Premium token fee{" "}
                        <FontAwesomeIcon icon={faQuestionCircle} />
                        <div className="tooltip p-3.5 rounded-2xl right-5 bottom-4 absolute min-w-52 max-w-64">
                            This fee is required to claim premium tokens.
                        </div>
                    </div>
                </div>
            ) : null}
            <div className={`${CLASS}__row`}>
                <div>{lovelaceToAda(deposit)} ADA</div>
                <div>You Send</div>
            </div>
            <div className={`${CLASS}__row`}>
                <div>
                    {lovelaceToAda(
                        calcReturnedAda(
                            deposit,
                            settings.withdrawalFee,
                            settings.serviceFee,
                            settings.txFee,
                            unlock,
                            settings.tosifee
                        )
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

const calcReturnedAda = (
    deposit: number,
    withdrawalFee: number,
    serviceFee: number,
    txFee: number,
    unlock: boolean,
    tosifee: number
) => {
    let returnedAda = deposit - withdrawalFee - serviceFee - txFee;
    if (unlock) returnedAda -= tosifee;
    return returnedAda;
};

import { useEffect, useState } from "react";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { getFeatures, getSettings } from "src/services/common";
import { lovelaceToAda } from "src/utils";

interface Props {
  numberOfTokens: number;
  deposit: number;
  unlock: boolean;
  isWhitelisted: boolean;
}

interface ISettings {
  vmFee: number;
  txFee: number;
  tosiFee: number;
}

const TransactionDetail = ({
  numberOfTokens,
  deposit,
  unlock,
  isWhitelisted,
}: Props) => {
  const [settings, setSettings] = useState<ISettings>({
    vmFee: 0,
    txFee: 180000,
    tosiFee: 500000,
  });

  useEffect(() => {
    const getSettingsFromApi = async () => {
      const settingsFromVM = await getSettings();
      const settingsFromFeatures = await getFeatures();
      setSettings({
        ...settings,
        tosiFee: settingsFromFeatures.tosi_fee,
        vmFee: settingsFromVM.withdrawal_fee,
      });
    };
    getSettingsFromApi();
  }, []);

  const calcTxFee = () => {
    let txCalc = ((numberOfTokens / 5) * settings.txFee).toFixed(6);
    if (Number(txCalc) >= Number(settings.txFee)) return Number(txCalc);
    return Number(settings.txFee);
  };

  const calcReturnedAda = () => {
    let returnedAda = deposit - settings.vmFee - calcTxFee();
    if (unlock && !isWhitelisted) returnedAda -= settings.tosiFee;
    return returnedAda;
  };

  return (
    <div className="background rounded-2xl p-5">
      Transaction Detail
      <div className="p-1 flex items-center flex-row-reverse border-b border-color">
        <div className="w-28 text-right">{numberOfTokens} tokens</div>
        <div className="text-right">Total tokens selected</div>
      </div>
      <div className="p-1 flex items-center flex-row-reverse border-b border-color">
        <div className="w-28 text-right">
          {lovelaceToAda(settings.vmFee)} ADA
        </div>
        <div className="text-right">Processing fee</div>
      </div>
      <div className="p-1 flex items-center flex-row-reverse border-b border-color">
        <div className="w-28 text-right">{lovelaceToAda(calcTxFee())} ADA</div>
        <div className="text-right">Transaction fee</div>
      </div>
      {unlock && !isWhitelisted ? (
        <div className="p-1 flex items-center flex-row-reverse border-b border-color text-premium">
          <div className="w-28 text-right">
            {lovelaceToAda(settings.tosiFee)} ADA
          </div>
          <div className="tooltip-activator cursor-help text-right">
            Premium token fee <FontAwesomeIcon icon={faQuestionCircle} />
            <div className="tooltip p-3.5 rounded-2xl right-5 bottom-4 absolute min-w-52 max-w-64">
              This fee is required to claim premium tokens.
            </div>
          </div>
        </div>
      ) : null}
      <div className="p-1 flex items-center flex-row-reverse border-b border-color">
        <div className="w-28 text-right">{lovelaceToAda(deposit)} ADA</div>
        <div className="text-right">You Send</div>
      </div>
      <div className="p-1 flex items-center flex-row-reverse border-b border-color">
        <div className="w-28 text-right">
          {lovelaceToAda(calcReturnedAda())} ADA
        </div>
        <div className="text-right">You'll get back (Approximately)</div>
      </div>
      <div className="mt-1 text-right text-yellow-400">
        The transaction fee is just an approximation, but it won't differ so
        much from the displayed value.
      </div>
    </div>
  );
};

export default TransactionDetail;

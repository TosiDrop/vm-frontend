import { getNameFromHex } from "src/services/utils.services";
import "./index.scss";

interface Props {
    index: number;
    ticker: string;
    checked: boolean;
    handleOnChange: Function;
    amount: number;
    decimals: number;
    logo: string;
    assetId: string;
}

const ClaimableTokenBox = ({
    index,
    ticker,
    checked,
    handleOnChange,
    amount,
    decimals,
    logo,
    assetId,
}: Props) => {
    return (
        <div className="claim-item" key={index}>
            <div className="selection">
                <label className="noselect">
                    <input
                        type="checkbox"
                        id={`custom-checkbox-${index}`}
                        name={ticker}
                        value={ticker}
                        checked={checked}
                        onChange={() => handleOnChange(index)}
                    />
                    {amount / Math.pow(10, decimals)} available
                </label>
            </div>
            <div className="token-drop">
                <div className="token-info">
                    <img alt="" src={logo}></img>
                    <div>
                        {ticker}
                        {/* {assetId.split(".").length > 1
                            ? getNameFromHex(assetId.split(".")[1])
                            : getNameFromHex(assetId.split(".")[0])} */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClaimableTokenBox;

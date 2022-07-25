import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
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
    premium: boolean;
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
    premium,
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
                {premium ? (
                    <span className="premium-token tooltip-activator">
                        <FontAwesomeIcon icon={faStar} />
                        <div className="tooltip w-64 p-3.5 rounded-2xl right-5 bottom-5 absolute">
                            The star indicates premium token. Premium token
                            requires premium fee to claim.
                        </div>
                    </span>
                ) : null}
            </div>
            <div className="token-drop">
                <div className="token-info">
                    <img alt="" src={logo} className="mx-auto my-5"></img>
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

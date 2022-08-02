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
        <div
            className="mt-5 background rounded-2xl p-5 w-fit flex flex-col items-center w-full sm:w-64 mr-5"
            key={index}
        >
            <div className="w-full flex flex-row items-center">
                <label className="flex flex-row items-center mr-auto">
                    <input
                        type="checkbox"
                        id={`custom-checkbox-${index}`}
                        name={ticker}
                        value={ticker}
                        checked={checked}
                        onChange={() => handleOnChange(index)}
                        className="mr-1"
                    />
                    {amount / Math.pow(10, decimals)} available
                </label>
                {premium ? (
                    <span className="premium-token tooltip-activator ml-auto">
                        <FontAwesomeIcon className="premium" icon={faStar} />
                        <div className="tooltip w-64 p-3.5 rounded-2xl right-5 bottom-5 absolute">
                            The star indicates premium token. Premium token
                            requires premium fee to claim.
                        </div>
                    </span>
                ) : null}
            </div>
            <div className="mt-5">
                <img alt="" src={logo} className=" h-24"></img>
                <div className="text-center mt-5">
                    {ticker}
                    {/* {assetId.split(".").length > 1
                        ? getNameFromHex(assetId.split(".")[1])
                        : getNameFromHex(assetId.split(".")[0])} */}
                </div>
            </div>
        </div>
    );
};

export default ClaimableTokenBox;

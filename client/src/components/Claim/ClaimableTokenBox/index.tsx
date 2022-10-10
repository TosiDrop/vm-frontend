import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import "./index.scss";

interface Props {
  index: number;
  ticker: string;
  selected: boolean;
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
  selected,
  handleOnChange,
  amount,
  decimals,
  logo,
  assetId,
  premium,
}: Props) => {
  return (
    <div
      className={`box-border cursor-pointer background rounded-2xl p-5 flex flex-col gap-4 items-center w-full sm:w-60 border-2 duration-200 ${
        selected ? "border-selected" : "border-transparent"
      }`}
      key={index}
      onClick={() => handleOnChange(index)}
    >
      <div className="w-full flex flex-row items-center">
        <div>{amount / Math.pow(10, decimals)} available</div>
        {premium ? (
          <span className="premium-token tooltip-activator ml-auto">
            <FontAwesomeIcon
              className="text-premium cursor-help premium-pulse"
              icon={faStar}
            />
            <div className="tooltip w-64 p-3.5 rounded-2xl right-5 bottom-5 absolute">
              The star indicates premium token. Premium token requires premium
              fee to claim.
            </div>
          </span>
        ) : null}
      </div>
      <img alt="" src={logo} className=" h-24"></img>
      <div className="text-center">{ticker}</div>
    </div>
  );
};

export default ClaimableTokenBox;

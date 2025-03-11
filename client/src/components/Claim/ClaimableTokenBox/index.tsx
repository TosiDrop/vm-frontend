interface Props {
  index: number;
  ticker: string;
  selected: boolean;
  handleOnChange: Function;
  amount: number;
  decimals: number;
  logo: string;
  assetId: string;
}

const ClaimableTokenBox = ({
  index,
  ticker,
  selected,
  handleOnChange,
  amount,
  logo,
}: Props) => {
  return (
    <div
      className={`box-border cursor-pointer background rounded-2xl p-4 flex flex-col gap-4 items-center w-full sm:w-60 border-2 duration-200 ${
        selected ? "border-selected" : "border-transparent"
      }`}
      key={index}
      onClick={() => handleOnChange(index)}
    >
      <img alt="logo" src={logo} className="h-24"></img>
      <div>
        <div className="text-center">{ticker}</div>
        <div className="text-sm">{amount} available</div>
      </div>
    </div>
  );
};

export default ClaimableTokenBox;

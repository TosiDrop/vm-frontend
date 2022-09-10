import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import useComponentVisible from "src/hooks/useComponentVisible";
import { Token, getRealAmount } from "../../utils";
import Spinner from "../../../../components/Spinner";

interface Props {
  tokens: Token[];
  setSelectedToken: Function;
}

const Select = ({ tokens, setSelectedToken }: Props) => {
  const { visible, ref, setVisible } = useComponentVisible(false);
  const [disabled, setDisabled] = useState<boolean>(true);
  const [selected, setSelected] = useState<string>("");
  const api = useSelector((state: RootState) => state.wallet.api);

  const selectOption = (v: Token) => {
    setVisible(false);
    setSelected(v.ticker);
    setSelectedToken(v);
  };

  const getBtnText = () => {
    switch (true) {
      case api == null:
        return <>Connect wallet to select token</>;
      case disabled:
        return (
          <>
            Loading tokens<Spinner></Spinner>
          </>
        );
      case selected !== "":
        return <>selected</>;
      default:
        return <>Select Token</>;
    }
  };

  useEffect(() => {
    if (tokens.length) {
      setDisabled(false);
      return;
    }
    setDisabled(true);
  }, [tokens]);

  return (
    <div ref={ref} className="">
      <div className="" onClick={() => !disabled && setVisible(!visible)}>
        {getBtnText()}
      </div>
      <div className="">
        {tokens.map((token) => {
          return (
            <div
              key={token.ticker}
              className=""
              onClick={() => selectOption(token)}
            >
              <span>{token.ticker}</span>
              <span>{getRealAmount(token.amount, token.decimals)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Select;

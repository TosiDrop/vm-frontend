import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import useComponentVisible from "src/hooks/useComponentVisible";
import { Token, getRealAmount } from "../../utils";
import "./index.scss";
import Spinner from "../Spinner";

const CLASS = "token-select";

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
        <div
            ref={ref}
            className={`${CLASS} ${disabled ? `${CLASS}__disabled` : ""}`}
        >
            <div
                className={`${CLASS}__select-btn`}
                onClick={() => !disabled && setVisible(!visible)}
            >
                {getBtnText()}
            </div>
            <div
                className={`${CLASS}__options ${
                    visible ? `${CLASS}__options-visible` : ""
                }`}
            >
                {tokens.map((token) => {
                    return (
                        <div
                            key={token.ticker}
                            className={`${CLASS}__option`}
                            onClick={() => selectOption(token)}
                        >
                            <span>{token.ticker}</span>
                            <span>
                                {getRealAmount(token.amount, token.decimals)}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Select;

import { useEffect, useState } from "react";
import useComponentVisible from "src/hooks/useComponentVisible";
import { Token, getRealAmount } from "../../utils";
import "./index.scss";

const CLASS = "token-select";

interface Props {
    tokens: Token[];
    setSelectedToken: Function;
}

const Select = ({ tokens, setSelectedToken }: Props) => {
    const { visible, ref, setVisible } = useComponentVisible(false);
    const [disabled, setDisabled] = useState<boolean>(true);
    const [selected, setSelected] = useState<string>("");

    const selectOption = (v: Token) => {
        setVisible(false);
        setSelected(v.ticker);
        setSelectedToken(v);
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
                {getBtnText(disabled, selected)}
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

const getBtnText = (disabled: boolean, selected: string) => {
    if (disabled) {
        return "Connect wallet to select token";
    }
    if (selected) {
        return selected;
    }
    return "Select Token";
};

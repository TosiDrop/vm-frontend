import { useState } from "react";
import "./index.scss";

const options = ["hello", "world", "ada", "sundae"];

const CLASS = "token-select";

const Select = () => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState("");

    const selectOption = (v: string) => {
        setOpen(false);
        setSelected(v);
    };
    
    return (
        <div className={`${CLASS}`}>
            <div
                className={`${CLASS}__select-btn`}
                onClick={() => setOpen(!open)}
            >
                {selected ? selected : "Select Token"}
            </div>
            <div
                className={`${CLASS}__options ${
                    open ? `${CLASS}__options-visible` : ""
                }`}
            >
                {options.map((o) => {
                    return (
                        <div
                            className={`${CLASS}__option`}
                            onClick={() => selectOption(o)}
                        >
                            {o}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Select;

import { Link, useLocation } from "react-router-dom";
import "./type-buttons.component.scss";

enum TypeButton {
    claim = "claim",
    airdrop = "airdrop",
}

function TypeButtonsComponent() {
    let location = useLocation().pathname;
    return (
        <div className="type-buttons">
            <Link to="/">
                <div
                    className={`claim ${location === "/" ? "is-selected" : ""}`}
                >
                    Claim
                </div>
            </Link>
            <Link to="/airdrop">
                <div
                    className={`airdrop ${
                        location === "/airdrop" ? "is-selected" : ""
                    }`}
                >
                    Airdrop
                </div>
            </Link>
        </div>
    );
}

export default TypeButtonsComponent;

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSun } from "@fortawesome/free-solid-svg-icons";
import WalletSelectorComponent from "../components/wallet-selector/wallet-selector.component";
import logo from "../assets/tosidrop_logo.png";
import { useDispatch } from "react-redux";
import { toggleMenu, toggleTheme } from "src/reducers/globalSlice";
import useWallet from "src/hooks/useWallet";
import "./header.layout.scss";

function Header() {
    const dispatch = useDispatch();
    const { connectWallet } = useWallet();

    return (
        <div className="header">
            <div className="header-title">
                <div className="logo-container">
                    <img src={logo} className="logo" alt=""></img>
                </div>
                <p className="title-text">TosiDrop</p>
                <div className="header-filler"></div>
                <div className="header-wallet-selector noselect">
                    <WalletSelectorComponent connectWallet={connectWallet} />
                </div>
                <div className="last">
                    <button
                        className="light-button button"
                        onClick={() => dispatch(toggleTheme())}
                    >
                        <FontAwesomeIcon icon={faSun} />
                    </button>
                    <button
                        className="menu-button button"
                        onClick={() => dispatch(toggleMenu())}
                    >
                        <FontAwesomeIcon icon={faBars} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Header;

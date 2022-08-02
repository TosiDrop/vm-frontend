// import BlockchainSelector from "src/components/BlockchainSelector";
import { Themes } from "src/entities/common.entities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import WalletSelector from "src/components/WalletSelector";
import { RootState } from "src/store";
import logo from "../assets/tosidrop_logo.png";
import { useDispatch, useSelector } from "react-redux";
import { toggleMenu, toggleTheme } from "src/reducers/globalSlice";
import useWallet from "src/hooks/useWallet";
import "./header.layout.scss";

function Header() {
    const dispatch = useDispatch();
    const { theme } = useSelector((state: RootState) => state.global);
    const { connectWallet } = useWallet();

    return (
        <div className="header">
            <div className="header-title">
                <div className="logo-container">
                    <img src={logo} className="logo" alt=""></img>
                </div>
                <p className="title-text">TosiDrop</p>
                <div className="header-filler"></div>
                {/* <BlockchainSelector></BlockchainSelector> */}
                <div className="header-wallet-selector noselect">
                    <WalletSelector connectWallet={connectWallet} />
                </div>
                <div className="ml-auto h-full text text-base">
                    <button
                        className="h-full background rounded-lg px-5"
                        onClick={() => dispatch(toggleTheme())}
                    >
                        <FontAwesomeIcon
                            icon={theme === Themes.dark ? faSun : faMoon}
                        />
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

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSun } from "@fortawesome/free-solid-svg-icons";
import WalletSelectorComponent from "../components/wallet-selector/wallet-selector.component";
import WalletApi, { WalletKeys } from "../services/connectors/wallet.connector";
import logo from "../assets/tosidrop_logo.png";
import "./header.layout.scss";

interface Params {
    toggleMenu: () => void;
    toggleTheme: () => void;
    connectWallet: (walletKey?: WalletKeys) => void;
    connectedWallet: WalletApi | undefined;
    wrongNetwork: boolean | undefined;
}
function Header({
    toggleMenu,
    toggleTheme,
    connectWallet,
    connectedWallet,
    wrongNetwork,
}: Params) {
    return (
        <div className="header">
            <div className="header-title">
                <div className="logo-container">
                    <img src={logo} className="logo" alt=""></img>
                </div>
                <p className="title-text">TosiDrop</p>
                <div className="header-filler"></div>
                <div className="header-wallet-selector noselect">
                    <WalletSelectorComponent
                        connectedWallet={connectedWallet}
                        connectWallet={connectWallet}
                        wrongNetwork={wrongNetwork}
                    />
                </div>
                <div className="last">
                    <button
                        className="button light-button"
                        onClick={toggleTheme}
                    >
                        <FontAwesomeIcon icon={faSun} />
                    </button>
                    <button className="button menu-button" onClick={toggleMenu}>
                        <FontAwesomeIcon icon={faBars} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Header;

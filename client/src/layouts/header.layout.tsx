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

function Header() {
    const dispatch = useDispatch();
    const { theme } = useSelector((state: RootState) => state.global);
    const { connectWallet } = useWallet();

    return (
        <div className="flex flex-row items-center w-full p-5 pb-0">
            <div className="h-full flex flex-row items-center">
                <img src={logo} className="h-10 logo" alt="tosidrop logo"></img>
                <p className="ml-2.5 font-semibold text-lg">TosiDrop</p>
            </div>
            <div className="flex flex-row items-center ml-auto">
                <WalletSelector connectWallet={connectWallet} />
                <button
                    className="h-full background rounded-lg px-5 py-2.5 ml-2.5"
                    onClick={() => dispatch(toggleTheme())}
                >
                    <FontAwesomeIcon
                        icon={theme === Themes.dark ? faSun : faMoon}
                    />
                </button>
                <button
                    className="background rounded-lg px-5 py-2.5 ml-2.5 sm:hidden"
                    onClick={() => dispatch(toggleMenu())}
                >
                    <FontAwesomeIcon icon={faBars} />
                </button>
            </div>
        </div>
    );
}

export default Header;

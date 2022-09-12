// import BlockchainSelector from "src/components/BlockchainSelector";
import { Themes } from "src/entities/common.entities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import WalletSelector from "src/components/WalletSelector";
import { RootState } from "src/store";
import logo from "src/assets/tosidrop_logo.png";
import logoLight from "src/assets/tosidrop-light.png"
import logoDark from "src/assets/tosidrop-dark.png"
import { useDispatch, useSelector } from "react-redux";
import { toggleMenu, toggleTheme } from "src/reducers/globalSlice";
import useWallet from "src/hooks/useWallet";
import { Link } from "react-router-dom";

function Header() {
  const dispatch = useDispatch();
  const { theme } = useSelector((state: RootState) => state.global);
  const { connectWallet } = useWallet();

  return (
    <>
      {/* Web header */}
      <div className="flex-row items-center w-full p-5 pb-0 hidden sm:flex">
        <Link to="/">
          <div className="h-full">
            <img src={theme === Themes.dark ? logoDark : logoLight} className="h-10 logo" alt="tosidrop logo"></img>
          </div>
        </Link>
        <div className="flex flex-row items-center ml-auto">
          <WalletSelector connectWallet={connectWallet} />
          <button
            className="h-full background rounded-lg px-5 py-2.5 ml-2.5"
            onClick={() => dispatch(toggleTheme())}
          >
            <FontAwesomeIcon icon={theme === Themes.dark ? faSun : faMoon} />
          </button>
        </div>
      </div>

      {/* Mobile header */}
      <div className="flex flex-row items-center justify-center h-fit m-5 mb-0 visible sm:hidden">
        <div className="flex flex-row items-center mr-auto">
          <button
            className="background rounded-lg px-5 py-2.5"
            onClick={() => dispatch(toggleMenu())}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
        <p className="font-semibold text-2xl">TosiDrop</p>
        <img src={logo} className="h-10 logo ml-auto" alt="tosidrop logo"></img>
      </div>
    </>
  );
}

export default Header;

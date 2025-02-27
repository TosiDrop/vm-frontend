import { faBars, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import logoDark from "src/assets/tosidrop-dark.png";
import logoLight from "src/assets/tosidrop-light.png";
import { Themes } from "src/entities/common.entities";
import { toggleMenu, toggleTheme } from "src/reducers/globalSlice";
import { RootState } from "src/store";
import Banner from "../Banner";
import CardanoWalletSelector from "../WalletSelector/CardanoWalletSelector";

function Header() {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.global.theme);

  return (
    <>
      <Banner></Banner>

      {/* Web header */}
      <div className="flex-row items-center max-w-8xl w-full p-5 pb-0 hidden sm:flex">
        <Link to="/">
          <div className="">
            <img
              src={theme === Themes.dark ? logoDark : logoLight}
              className="h-10 logo"
              alt="tosidrop logo"
            ></img>
          </div>
        </Link>
        <div className="flex flex-row gap-4 items-center ml-auto">
          <CardanoWalletSelector></CardanoWalletSelector>
          <button
            className="background rounded-lg px-5 py-3.5"
            onClick={() => dispatch(toggleTheme())}
          >
            <FontAwesomeIcon icon={theme === Themes.dark ? faSun : faMoon} />
          </button>
        </div>
      </div>

      {/* Mobile header */}
      <div className="w-full flex flex-row items-center justify-between p-5 pb-0 h-fit sm:hidden">
        <div>
          <img
            src={theme === Themes.dark ? logoDark : logoLight}
            className="h-10 logo"
            alt="tosidrop logo"
          ></img>
        </div>
        <div className="flex gap-4">
          <div className="flex flex-row items-center mr-auto w-14">
            <button
              className="background rounded-lg py-2.5 w-full"
              onClick={() => dispatch(toggleMenu())}
            >
              <FontAwesomeIcon icon={faBars} />
            </button>
          </div>
          <div className="h-full ml-auto">
            <CardanoWalletSelector></CardanoWalletSelector>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;

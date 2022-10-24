import {
  faArrowUpRightFromSquare,
  faBook,
  faMoon,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import CardanoLogo from "src/assets/cardanologo.svg";
import ErgoLogo from "src/assets/ergologo.svg";
import {
  PageRoute,
  SocialMediaItem,
  Themes,
} from "src/entities/common.entities";
import { setShowMenu, toggleTheme } from "src/reducers/globalSlice";
import { RootState } from "src/store";
import { socialMediaItems } from "../Menu/agnostic";
import "./index.scss";

export default function MobileMenuAgnostic() {
  const showMenu = useSelector((state: RootState) => state.global.showMenu);
  const theme = useSelector((state: RootState) => state.global.theme);
  const location = useLocation().pathname;
  const dispatch = useDispatch();

  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !(ref.current as any).contains(event.target)) {
        dispatch(setShowMenu(false));
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [dispatch]);

  const SocialMediaButton = ({
    socialMediaItem,
  }: {
    socialMediaItem: SocialMediaItem;
  }) => {
    return (
      <a
        href={socialMediaItem.url}
        target="_blank"
        rel="noreferrer"
        className={`text-xl ${socialMediaItem.colorClassname}`}
      >
        <FontAwesomeIcon icon={socialMediaItem.icon} />
      </a>
    );
  };

  return (
    <div className="absolute top-0 left-0 z-10 w-0 h-0">
      <div
        className={`duration-200 w-screen h-screen layover ${
          showMenu ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      ></div>
      <div
        className={`duration-200 w-64 background absolute top-0 -left-64 h-screen text z-10 p-5 ${
          showMenu ? "translate-x-64" : "translate-x-0"
        }`}
        ref={ref}
      >
        <div className="flex flex-col gap-2">
          <Link
            to={PageRoute.claimCardano}
            className="text-inactive flex flex-row items-center gap-2"
            onClick={() => dispatch(setShowMenu(false))}
          >
            <div className="h-4">
              <img className="h-full" src={CardanoLogo}></img>
            </div>
            Cardano
          </Link>
          <Link
            to={PageRoute.claimErgo}
            className="text-inactive flex flex-row items-center gap-2"
            onClick={() => dispatch(setShowMenu(false))}
          >
            <div className="h-4">
              <img className="h-full" src={ErgoLogo}></img>
            </div>
            Ergo
          </Link>
          <div onClick={() => dispatch(setShowMenu(false))} className="mb-2.5">
            <a
              target="_blank"
              rel="noreferrer"
              href="https://docs.tosidrop.io/"
              className="mb-2.5 text-inactive"
            >
              <FontAwesomeIcon className="mr-2.5" icon={faBook} />
              Docs&nbsp;
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </a>
          </div>
          <div className="mb-2.5">
            <div className={`text flex items-center`}>
              <FontAwesomeIcon icon={faSun} />
              <label className="switch mx-2.5">
                <input
                  type="checkbox"
                  checked={theme === Themes.dark ? true : false}
                  onChange={() => dispatch(toggleTheme())}
                />
                <span className="slider round"></span>
              </label>
              <FontAwesomeIcon icon={faMoon} />
            </div>
          </div>
        </div>
        <div className="mt-10 flex items-center justify-center gap-4">
          {Object.values(socialMediaItems).map(
            (socialMediaItem: SocialMediaItem) => (
              <SocialMediaButton
                key={socialMediaItem.url}
                socialMediaItem={socialMediaItem}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}

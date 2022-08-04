import { RootState } from "src/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { setShowMenu, toggleTheme } from "src/reducers/globalSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faWallet,
    faPaperPlane,
    faMessage,
    faBook,
    faArrowUpRightFromSquare,
    faSun,
    faMoon,
} from "@fortawesome/free-solid-svg-icons";
import {
    faTwitter,
    faDiscord,
    faTelegram,
} from "@fortawesome/free-brands-svg-icons";
import "./index.scss";
import { Link, useLocation } from "react-router-dom";
import { Themes } from "src/entities/common.entities";

const CLASS = "mobile-menu";

const MobileMenu = () => {
    const showMenu = useSelector((state: RootState) => state.global.showMenu);
    const theme = useSelector((state: RootState) => state.global.theme);
    const location = useLocation().pathname;
    const dispatch = useDispatch();

    const getClassForMenu = (prefix: string) => {
        if (showMenu) return `${CLASS}__${prefix}-visible`;
        return `${CLASS}__${prefix}-hidden`;
    };

    const getClassForListItem = (itemLocation: string) => {
        let compareLocation = location;
        if (location === "/claim/") {
            compareLocation = "/";
        }

        return `${compareLocation === itemLocation ? "text" : "text-inactive"}`;
    };

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
                <ul className={`${CLASS}__list`}>
                    <li
                        onClick={() => dispatch(setShowMenu(false))}
                        className="mb-2.5"
                    >
                        <Link to="/" className={getClassForListItem("/")}>
                            <FontAwesomeIcon
                                className="mr-2.5"
                                icon={faWallet}
                            />
                            Claim
                        </Link>
                    </li>
                    <li
                        onClick={() => dispatch(setShowMenu(false))}
                        className="mb-2.5"
                    >
                        <Link
                            to="/airdrop"
                            className={getClassForListItem("/airdrop")}
                        >
                            <FontAwesomeIcon
                                className="mr-2.5"
                                icon={faPaperPlane}
                            />
                            Airdrop
                        </Link>
                    </li>
                    <li
                        onClick={() => dispatch(setShowMenu(false))}
                        className="mb-2.5"
                    >
                        <Link
                            to="/feedback"
                            className={getClassForListItem("/feedback")}
                        >
                            <FontAwesomeIcon
                                className="mr-2.5"
                                icon={faMessage}
                            />
                            Feedback
                        </Link>
                    </li>
                    <li
                        onClick={() => dispatch(setShowMenu(false))}
                        className="mb-2.5"
                    >
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
                    </li>
                    <li className="mb-2.5">
                        <div className={`text flex items-center`}>
                            <FontAwesomeIcon icon={faSun} />
                            <label className="switch mx-2.5">
                                <input
                                    type="checkbox"
                                    checked={
                                        theme === Themes.dark ? true : false
                                    }
                                    onChange={() => dispatch(toggleTheme())}
                                />
                                <span className="slider round"></span>
                            </label>
                            <FontAwesomeIcon icon={faMoon} />
                        </div>
                    </li>
                </ul>
                <div className="mt-10 flex items-center justify-center gap-5">
                    <a
                        href="https://twitter.com/TosiDrop"
                        target="_blank"
                        rel="noreferrer"
                        className="text-xl text-twitter"
                    >
                        <FontAwesomeIcon icon={faTwitter} />
                    </a>
                    <a
                        href="https://discord.gg/C32Mm3j4fG"
                        target="_blank"
                        rel="noreferrer"
                        className="text-xl text-discord"
                    >
                        <FontAwesomeIcon icon={faDiscord} />
                    </a>
                    <a
                        href="https://t.me/+FdDUmLsW8jI0YmUx"
                        target="_blank"
                        rel="noreferrer"
                        className="text-xl text-telegram"
                    >
                        <FontAwesomeIcon icon={faTelegram} />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default MobileMenu;

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faWallet,
    faPaperPlane,
    faMessage,
    faBook,
    faArrowUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import {
    faTwitter,
    faDiscord,
    faTelegram,
} from "@fortawesome/free-brands-svg-icons";
import { Link, useLocation } from "react-router-dom";
import { RootState } from "src/store";
import { useDispatch, useSelector } from "react-redux";
import { setShowMenu } from "src/reducers/globalSlice";

function Menu() {
    const location = useLocation().pathname;
    const dispatch = useDispatch();
    const showMenu = useSelector((state: RootState) => state.global.showMenu);

    return (
        <>
            <div
                className={`${
                    !showMenu ? "visible" : "invisible"
                } fixed top-52 left-20 background text p-5 rounded-2xl min-w-40`}
            >
                <div className="menu">
                    <div className="menu-content">
                        <ul className="menu-list">
                            <li>
                                <Link
                                    to="/"
                                    className={`${
                                        location === "/" ||
                                        location === "/claim/"
                                            ? "text"
                                            : "text-inactive"
                                    } flex flex-row items-center`}
                                >
                                    <p className="icon">
                                        <FontAwesomeIcon
                                            className="mr-2.5"
                                            icon={faWallet}
                                        />
                                    </p>
                                    Claim
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/airdrop"
                                    className={`${
                                        location === "/airdrop"
                                            ? "text"
                                            : "text-inactive"
                                    } flex flex-row items-center mt-2.5`}
                                >
                                    <p className="icon">
                                        <FontAwesomeIcon
                                            className="mr-2.5"
                                            icon={faPaperPlane}
                                        />
                                    </p>
                                    Airdrop
                                </Link>
                            </li>
                            {/* <li><Link to="/history"><p className="icon"><FontAwesomeIcon className="mr-2.5"  icon={faClockRotateLeft} /></p>History</Link></li> */}
                            {/* <li><Link to="/dashboard"><p className="icon"><FontAwesomeIcon className="mr-2.5"  icon={faChartColumn} /></p>Dashboard</Link></li> */}
                            <li>
                                <Link
                                    to="/feedback"
                                    className={`${
                                        location === "/feedback"
                                            ? "text"
                                            : "text-inactive"
                                    } flex flex-row items-center mt-2.5`}
                                >
                                    <p className="icon">
                                        <FontAwesomeIcon
                                            className="mr-2.5"
                                            icon={faMessage}
                                        />
                                    </p>
                                    Feedback
                                </Link>
                            </li>
                            <li>
                                <a
                                    target="_blank"
                                    rel="noreferrer"
                                    href="https://docs.tosidrop.io/"
                                    className="flex flex-row items-center mt-2.5 text-inactive"
                                >
                                    <p className="icon">
                                        <FontAwesomeIcon
                                            className="mr-2.5"
                                            icon={faBook}
                                        />
                                    </p>
                                    Docs&nbsp;
                                    <FontAwesomeIcon
                                        className="mr-2.5"
                                        icon={faArrowUpRightFromSquare}
                                    />
                                </a>
                            </li>
                        </ul>
                        <div className="mt-5 w-full text-center">
                            <a
                                href="https://twitter.com/TosiDrop"
                                target="_blank"
                                rel="noreferrer"
                                className="text-twitter"
                            >
                                <FontAwesomeIcon icon={faTwitter} />
                            </a>
                            <a
                                href="https://discord.gg/C32Mm3j4fG"
                                target="_blank"
                                rel="noreferrer"
                                className="ml-2.5 text-discord"
                            >
                                <FontAwesomeIcon icon={faDiscord} />
                            </a>
                            <a
                                href="https://t.me/+FdDUmLsW8jI0YmUx"
                                target="_blank"
                                rel="noreferrer"
                                className="ml-2.5 text-telegram"
                            >
                                <FontAwesomeIcon icon={faTelegram} />
                            </a>
                            {/* <a href='https://github.com/anetabtc' target='_blank' rel="noreferrer">
                            <FontAwesomeIcon icon={faGithub} />
                        </a> */}
                        </div>
                    </div>
                </div>
            </div>
            <div
                className={"gray-layer" + (!showMenu ? " layer-hidden" : "")}
                onClick={() => dispatch(setShowMenu(false))}
            ></div>
        </>
    );
}

export default Menu;

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
import "./menu.layout.scss";

interface Params {
    showMenu: boolean;
    setShowMenu: (showMenu: boolean) => void;
}

function Menu({ showMenu, setShowMenu }: Params) {
    const location = useLocation().pathname;

    return (
        <>
            <div
                className={"menu-container" + (!showMenu ? " menu-hidden" : "")}
            >
                <div className="menu">
                    <div className="menu-content">
                        <ul className="menu-list">
                            <li>
                                <Link
                                    to="/"
                                    className={
                                        location === "/" ||
                                        location === "/claim/"
                                            ? "menu-list-selected"
                                            : ""
                                    }
                                >
                                    <p className="icon">
                                        <FontAwesomeIcon icon={faWallet} />
                                    </p>
                                    Claim
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/airdrop"
                                    className={
                                        location === "/airdrop"
                                            ? "menu-list-selected"
                                            : ""
                                    }
                                >
                                    <p className="icon">
                                        <FontAwesomeIcon icon={faPaperPlane} />
                                    </p>
                                    Airdrop
                                </Link>
                            </li>
                            {/* <li><Link to="/history"><p className="icon"><FontAwesomeIcon icon={faClockRotateLeft} /></p>History</Link></li> */}
                            {/* <li><Link to="/dashboard"><p className="icon"><FontAwesomeIcon icon={faChartColumn} /></p>Dashboard</Link></li> */}
                            <li>
                                <Link
                                    to="/feedback"
                                    className={
                                        location === "/feedback"
                                            ? "menu-list-selected"
                                            : ""
                                    }
                                >
                                    <p className="icon">
                                        <FontAwesomeIcon icon={faMessage} />
                                    </p>
                                    Feedback
                                </Link>
                            </li>
                            <li>
                                <a
                                    target="_blank"
                                    rel="noreferrer"
                                    href="https://docs.tosidrop.io/"
                                >
                                    <p className="icon">
                                        <FontAwesomeIcon icon={faBook} />
                                    </p>
                                    Docs&nbsp;
                                    <FontAwesomeIcon
                                        icon={faArrowUpRightFromSquare}
                                    />
                                </a>
                            </li>
                        </ul>
                        <div className="menu-filler"></div>
                        <div className="social">
                            <a
                                href="https://twitter.com/TosiDrop"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <FontAwesomeIcon icon={faTwitter} />
                            </a>
                            <a
                                href="https://discord.gg/C32Mm3j4fG"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <FontAwesomeIcon icon={faDiscord} />
                            </a>
                            <a
                                href="https://t.me/+FdDUmLsW8jI0YmUx"
                                target="_blank"
                                rel="noreferrer"
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
                onClick={() => setShowMenu(false)}
            ></div>
        </>
    );
}

export default Menu;

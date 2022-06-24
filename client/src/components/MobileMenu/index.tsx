import { RootState } from "src/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { setShowMenu } from "src/reducers/globalSlice";
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
import "./index.scss";
import { Link, useLocation } from "react-router-dom";

const CLASS = "mobile-menu";

const MobileMenu = () => {
    const showMenu = useSelector((state: RootState) => state.global.showMenu);
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

        if (compareLocation === itemLocation)
            return `${CLASS}__list-selected ${CLASS}__list-item`;
        return `${CLASS}__list-item`;
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
        <div className={`${CLASS}`}>
            <div
                className={`${CLASS}__layer ${getClassForMenu("layer")}`}
            ></div>
            <div
                className={`${CLASS}__container ${getClassForMenu(
                    "container"
                )}`}
                ref={ref}
            >
                <ul className={`${CLASS}__list`}>
                    <li onClick={() => dispatch(setShowMenu(false))}>
                        <Link to="/" className={getClassForListItem("/")}>
                            <p className="icon">
                                <FontAwesomeIcon icon={faWallet} />
                            </p>
                            Claim
                        </Link>
                    </li>
                    <li onClick={() => dispatch(setShowMenu(false))}>
                        <Link
                            to="/airdrop"
                            className={getClassForListItem("/airdrop")}
                        >
                            <p className="icon">
                                <FontAwesomeIcon icon={faPaperPlane} />
                            </p>
                            Airdrop
                        </Link>
                    </li>
                    <li onClick={() => dispatch(setShowMenu(false))}>
                        <Link
                            to="/feedback"
                            className={getClassForListItem("/feedback")}
                        >
                            <p className="icon">
                                <FontAwesomeIcon icon={faMessage} />
                            </p>
                            Feedback
                        </Link>
                    </li>
                    <li onClick={() => dispatch(setShowMenu(false))}>
                        <a
                            target="_blank"
                            rel="noreferrer"
                            href="https://docs.tosidrop.io/"
                            className={`${CLASS}__list-item`}
                        >
                            <p className="icon">
                                <FontAwesomeIcon icon={faBook} />
                            </p>
                            Docs&nbsp;
                            <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                        </a>
                    </li>
                </ul>
                <div className={`${CLASS}__social`}>
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
                </div>
            </div>
        </div>
    );
};

export default MobileMenu;

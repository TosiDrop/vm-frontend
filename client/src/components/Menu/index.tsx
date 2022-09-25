import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faArrowUpRightFromSquare,
  faWallet,
  faPaperPlane,
  faMessage,
  faClockRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import {
  faTwitter,
  faDiscord,
  faTelegram,
  faMedium,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";
import { Link, useLocation } from "react-router-dom";
import { PageRoute, MenuItem } from "src/entities/common.entities";

export const menuItems: Record<string, MenuItem> = {
  claim: {
    text: "Claim",
    to: PageRoute.home,
    activeRoute: [PageRoute.claim, PageRoute.home],
    icon: faWallet,
  },
  // history: {
  //   text: "History",
  //   to: PageRoute.history,
  //   activeRoute: [PageRoute.history],
  //   icon: faClockRotateLeft,
  // },
  airdrop: {
    text: "Airdrop",
    to: PageRoute.airdrop,
    activeRoute: [PageRoute.airdrop],
    icon: faPaperPlane,
  },
  feedback: {
    text: "Feedback",
    to: PageRoute.feedback,
    activeRoute: [PageRoute.feedback],
    icon: faMessage,
  },
};

function Menu() {
  const location = useLocation().pathname;

  const LinkButton = ({ menuItem }: { menuItem: MenuItem }) => {
    return (
      <Link
        to={menuItem.to}
        className={`${
          menuItem.activeRoute.includes(location as PageRoute)
            ? "text"
            : "text-inactive"
        } flex flex-row items-center gap-2`}
      >
        <FontAwesomeIcon className="w-4" icon={menuItem.icon} />
        {menuItem.text}
      </Link>
    );
  };

  return (
    <div
      className={
        "background text-lg p-5 rounded-2xl w-56 h-fit hidden sm:block"
      }
    >
      <div className="menu">
        <div className="menu-content">
          <div className="flex flex-col gap-2">
            {Object.values(menuItems).map((menuItem: MenuItem) => (
              <LinkButton menuItem={menuItem} />
            ))}
            <div>
              <a
                target="_blank"
                rel="noreferrer"
                href="https://docs.tosidrop.io/"
                className="flex flex-row items-center gap-2 text-inactive"
              >
                <FontAwesomeIcon className="w-4" icon={faBook} />
                Docs
                <FontAwesomeIcon
                  className="w-4"
                  icon={faArrowUpRightFromSquare}
                />
              </a>
            </div>
          </div>
          <div className="mt-5 w-full text-center flex gap-2 items-center justify-center">
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
              className="text-discord"
            >
              <FontAwesomeIcon icon={faDiscord} />
            </a>
            <a
              href="https://t.me/+FdDUmLsW8jI0YmUx"
              target="_blank"
              rel="noreferrer"
              className="text-telegram"
            >
              <FontAwesomeIcon icon={faTelegram} />
            </a>
            <a
              href="https://medium.com/@tosidrop"
              target="_blank"
              rel="noreferrer"
              className="text"
            >
              <FontAwesomeIcon icon={faMedium} />
            </a>
            <a
              href="https://github.com/TosiDrop/vm-frontend"
              target="_blank"
              rel="noreferrer"
              className="text"
            >
              <FontAwesomeIcon icon={faGithub} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Menu;

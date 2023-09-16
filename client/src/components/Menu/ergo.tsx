import {
  faDiscord,
  faGithub,
  faMedium,
  faTelegram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import {
  faArrowUpRightFromSquare,
  faBook,
  faMessage,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation } from "react-router-dom";
import {
  MenuItem,
  PageRoute,
  SocialMediaItem,
} from "src/entities/common.entities";

export const socialMediaItems: Record<string, SocialMediaItem> = {
  twitter: {
    url: "https://twitter.com/TosiDrop",
    colorClassname: "text-twitter",
    icon: faTwitter,
  },
  discord: {
    url: "https://discord.gg/C32Mm3j4fG",
    colorClassname: "text-discord",
    icon: faDiscord,
  },
  telegram: {
    url: "https://t.me/+FdDUmLsW8jI0YmUx",
    colorClassname: "text-telegram",
    icon: faTelegram,
  },
  medium: {
    url: "https://medium.com/@tosidrop",
    colorClassname: "text",
    icon: faMedium,
  },
  github: {
    url: "https://github.com/TosiDrop",
    colorClassname: "text",
    icon: faGithub,
  },
};

export const menuItems: Record<string, MenuItem> = {
  // claim: {
  //   text: "Claim",
  //   to: PageRoute.claimCardano,
  //   activeRoute: [PageRoute.claimCardano, PageRoute.depositCardano],
  //   icon: faWallet,
  // },
  // // history: {
  // //   text: "History",
  // //   to: PageRoute.history,
  // //   activeRoute: [PageRoute.history],
  // //   icon: faClockRotateLeft,
  // // },
  // projects: {
  //   text: "Projects",
  //   to: PageRoute.projectsCardano,
  //   activeRoute: [PageRoute.projectsCardano],
  //   icon: faProjectDiagram,
  // },
  // /*dashboard: {
  //   text: "Dashboard",
  //   to: PageRoute.dashboardCardano,
  //   activeRoute: [PageRoute.dashboardCardano],
  //   icon: faTableColumns,
  // },*/
  feedback: {
    text: "Feedback",
    to: PageRoute.feedback,
    activeRoute: [PageRoute.feedback],
    icon: faMessage,
  },
};

export default function MenuErgo() {
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
        className={socialMediaItem.colorClassname}
      >
        <FontAwesomeIcon icon={socialMediaItem.icon} />
      </a>
    );
  };

  return (
    <div className="hidden sm:flex flex-col gap-8">
      <p className="text-3xl opacity-0">_</p>
      <div className={"background text-lg p-5 rounded-2xl w-56 h-fit"}>
        <div className="menu">
          <div className="menu-content">
            <div className="flex flex-col gap-2">
              {Object.values(menuItems).map((menuItem: MenuItem) => (
                <LinkButton key={menuItem.text} menuItem={menuItem} />
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
              {Object.values(socialMediaItems).map(
                (socialMediaItem: SocialMediaItem) => (
                  <SocialMediaButton
                    key={socialMediaItem.url}
                    socialMediaItem={socialMediaItem}
                  />
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

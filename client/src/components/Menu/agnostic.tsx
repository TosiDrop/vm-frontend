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
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import CardanoLogo from "src/assets/cardanologo.svg";
import ErgoLogo from "src/assets/ergologo.svg";
import { PageRoute, SocialMediaItem } from "src/entities/common.entities";

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

export default function MenuAgnostic() {
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
              <Link
                to={PageRoute.claimCardano}
                className="text-inactive flex flex-row items-center gap-2"
              >
                <div className="h-5">
                  <img className="h-full" src={CardanoLogo}></img>
                </div>
                Cardano
              </Link>
              <Link
                to={PageRoute.claimErgo}
                className="text-inactive flex flex-row items-center gap-2"
              >
                <div className="h-5">
                  <img className="h-full" src={ErgoLogo}></img>
                </div>
                Ergo
              </Link>
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
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faDiscord,
  faTelegram,
  faMedium,
} from "@fortawesome/free-brands-svg-icons";
import { ProjectURLs } from "src/entities/project.entities";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

const URLs = ({ projectURLs }: { projectURLs: ProjectURLs }) => {
  const render = (icon: IconProp, style: string, url?: string) => {
    return url ? (
      <a href={url} className={`${style} m-1`}>
        <FontAwesomeIcon icon={icon} />
      </a>
    ) : null;
  };

  const medium = render(faMedium, "text-medium", projectURLs.medium);
  const twitter = render(faTwitter, "text-twitter", projectURLs.twitter);
  const discord = render(faDiscord, "text-discord", projectURLs.discord);
  const telegram = render(faTelegram, "text-telegram", projectURLs.telegram);
  const cardanoScan = null;
  const poolpm = null;

  return (
    <div>
      {medium}
      {twitter}
      {discord}
      {telegram}
      {cardanoScan}
      {poolpm}
    </div>
  );
};

export default URLs;

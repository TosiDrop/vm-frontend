import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faDiscord,
  faMedium,
  faTelegram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ProjectURLs } from "src/entities/project.entities";

const URLs = ({ projectURLs }: { projectURLs: ProjectURLs }) => {
  const render = (icon: IconProp, style: string, url?: string) => {
    return url ? (
      <a href={url} className={`${style}`}>
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
    <div className="flex flex-row gap-2">
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

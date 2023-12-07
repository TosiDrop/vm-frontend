import { faCoins } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function NativefeeTooltip() {
  return (
    <span className="premium-token tooltip-activator">
      <FontAwesomeIcon
        className="text-premium cursor-help premium-pulse"
        icon={faCoins}
      />
      <div className="tooltip w-64 p-3.5 rounded-2xl right-5 bottom-5 absolute">
        Native Token Fee is applied to our native platform token.
      </div>
    </span>
  );
}

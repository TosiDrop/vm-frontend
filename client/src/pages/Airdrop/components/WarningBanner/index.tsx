import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWarning } from "@fortawesome/free-solid-svg-icons";

interface Props {
  isShown: boolean;
}

export default ({ isShown }: Props) => {
  return isShown ? (
    <div className="bg-yellow-400 rounded-2xl p-5 text-black flex gap-2 items-center">
      <FontAwesomeIcon icon={faWarning} />
      <span>
        This feature is working properly ONLY for Nami wallet. The use of other
        wallets is not recommended.
      </span>
    </div>
  ) : null;
};

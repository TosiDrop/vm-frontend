import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./index.scss";

const CLASS = "spinner";

const Spinner = ({ className }: { className?: string }) => {
  return (
    <div className={`${className} ${CLASS}`}>
      <div className={`${CLASS}__container`}>
        <FontAwesomeIcon icon={faCircleNotch} />
      </div>
    </div>
  );
};

export default Spinner;

import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./index.scss";

const CLASS = "spinner";

const Spinner = () => {
    return (
        <div className={CLASS}>
            <div className={`${CLASS}__container`}>
                <FontAwesomeIcon icon={faCircleNotch} />
            </div>
        </div>
    );
};

export default Spinner;

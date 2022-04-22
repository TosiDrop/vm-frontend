import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./index.scss";

const CLASS = "transaction-bar";

interface Props {
    status: string;
    tx: string;
}

const TransactionBar = () => {
    return (
        <div className={`${CLASS}`}>
            TX Info
            <button className={`${CLASS}__button ${CLASS}__button-airdrop`}>
                Sign
            </button>
            <div className={`${CLASS}__spinner`}>
                <FontAwesomeIcon icon={faCircleNotch} />
            </div>
        </div>
    );
};

export default TransactionBar;

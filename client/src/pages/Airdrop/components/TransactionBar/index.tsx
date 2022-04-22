import Spinner from "../Spinner";
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
            <Spinner></Spinner>
        </div>
    );
};

export default TransactionBar;

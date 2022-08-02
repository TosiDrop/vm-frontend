import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { WalletKeys } from "../../../services/connectors/wallet.connector";
import "./index.scss";

export interface Props {
    modalVisible: boolean;
    setModalVisible: any;
    visibilityRef: any;
    connectWallet: (walletKey?: WalletKeys) => void;
}

function WalletSelectorModal({
    modalVisible,
    setModalVisible,
    visibilityRef,
    connectWallet,
}: Props) {
    const hideModal = () => {
        setModalVisible(false);
    };

    return (
        <div
            className={
                "absolute invisible wallet-modal modal" + (modalVisible ? " is-active" : "")
            }
        >
            <div className="modal-background"></div>
            <div className="modal-content">
                <div className="box" ref={visibilityRef}>
                    <div className="wallet-modal-head">
                        <div className="wallet-text-content">
                            Connect wallet
                        </div>
                        <div className="wallet-modal-buttons">
                            <button
                                className="button is-wallet-background is-small"
                                onClick={hideModal}
                            >
                                <FontAwesomeIcon
                                    icon={faXmark}
                                ></FontAwesomeIcon>
                            </button>
                        </div>
                    </div>
                    <div className="wallet-modal-body">
                        {window.cardano ? (
                            Object.keys(WalletKeys).map((key) => {
                                if (window.cardano && window.cardano[key]) {
                                    const walletKey = key as WalletKeys;
                                    return (
                                        <div
                                            key={key}
                                            className={
                                                "wallet-modal-body-row" +
                                                (window.cardano[key]
                                                    ? ""
                                                    : " hidden")
                                            }
                                            onClick={() =>
                                                connectWallet(walletKey)
                                            }
                                        >
                                            <p>
                                                {window.cardano[key].name
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    window.cardano[
                                                        key
                                                    ].name.slice(1)}
                                            </p>
                                            <img
                                                src={window.cardano[key].icon}
                                                alt="wallet"
                                            ></img>
                                        </div>
                                    );
                                } else {
                                    return null;
                                }
                            })
                        ) : (
                            <div
                                className={"wallet-modal-body-row"}
                                onClick={() => {}}
                            >
                                <p>No Wallet found :(</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WalletSelectorModal;

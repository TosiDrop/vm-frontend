import { faLinkSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Spinner from "src/components/Spinner";
import { RootState } from "src/store";
import { WalletKeys } from "../../services/connectors/wallet.connector";
import { abbreviateAddress } from "../../services/utils.services";
import WalletSelectorModalComponent from "./wallet-selector-modal/wallet-selector-modal.component";
import "./wallet-selector.component.scss";

interface Params {
    connectWallet: (walletKey?: WalletKeys) => void;
}

function WalletSelectorComponent({ connectWallet }: Params) {
    const connectedWallet = useSelector(
        (state: RootState) => state.wallet.walletApi
    );
    const isWrongNetwork = useSelector(
        (state: RootState) => state.wallet.isWrongNetwork
    );

    const [modalVisible, setModalVisible] = useState(false);
    const [walletMenuVisible, setWalletMenuVisible] = useState(false);
    const [walletAddress, setWalletAddress] = useState("");
    const [walletIcon, setWalletIcon] = useState("");

    const disconnectWallet = () => {
        setWalletMenuVisible(false);
        connectWallet();
    };

    const toggleWalletMenuVisible = () => {
        setWalletMenuVisible(!walletMenuVisible);
    };

    useEffect(() => {
        async function init() {
            if (connectedWallet) {
                if (connectedWallet.wallet?.api) {
                    const addr = abbreviateAddress(
                        await connectedWallet.getAddress()
                    );
                    setWalletAddress(addr);
                    setWalletIcon(connectedWallet.wallet.icon);
                    setModalVisible(false);
                }
            } else {
                setWalletAddress("");
                setModalVisible(false);
            }
        }

        init();
    }, [connectedWallet?.wallet?.api, connectedWallet]);

    const Connected = () => {
        return (
            <div
                className="wallet-connected"
                onClick={() => toggleWalletMenuVisible()}
            >
                {walletIcon ? (
                    <>
                        <img
                            src={walletIcon}
                            className="wallet-icon"
                            alt="wallet icon"
                        ></img>
                        <p className="wallet-addr">{walletAddress}</p>
                    </>
                ) : (
                    <div className="wallet-info">
                        Connecting <Spinner></Spinner>
                    </div>
                )}
            </div>
        );
    };

    const NotConnected = () => (
        <div
            className="wallet-not-connected"
            onClick={() => setModalVisible(true)}
        >
            <p>Connect</p>
        </div>
    );

    const WrongNetwork = () => (
        <div
            className={"wallet-wrong"}
            onClick={() => toggleWalletMenuVisible()}
        >
            <p>WRONG NETWORK</p>
        </div>
    );

    return (
        <div className="wallet-selector-container">
            <WalletSelectorModalComponent
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                connectWallet={connectWallet}
            />
            <div className="wallet-selector">
                {isWrongNetwork ? (
                    <WrongNetwork />
                ) : connectedWallet?.wallet?.api ? (
                    <Connected />
                ) : (
                    <NotConnected />
                )}
            </div>
            <div
                className={
                    "wallet-menu" +
                    (connectedWallet?.wallet?.api && walletMenuVisible
                        ? ""
                        : " hidden")
                }
            >
                <p onClick={disconnectWallet}>
                    <FontAwesomeIcon icon={faLinkSlash} />
                    Disconnect
                </p>
            </div>
        </div>
    );
}

export default WalletSelectorComponent;

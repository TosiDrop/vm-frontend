import { faLinkSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "src/components/Spinner";
import useComponentVisible from "src/hooks/useComponentVisible";
import { RootState } from "src/store";
import { WalletKeys } from "../../services/connectors/wallet.connector";
import { abbreviateAddress } from "../../services/utils.services";
import WalletSelectorModal from "./WalletSelectorModal";
import "./index.scss";
import { showModal } from "src/reducers/globalSlice";
import { ModalTypes } from "src/entities/common.entities";
// import { setShowWalletModal } from "src/reducers/globalSlice";

interface Props {
    connectWallet: (walletKey?: WalletKeys) => void;
}

function WalletSelector({ connectWallet }: Props) {
    const dispatch = useDispatch();
    const connectedWallet = useSelector(
        (state: RootState) => state.wallet.walletApi
    );
    const isWrongNetwork = useSelector(
        (state: RootState) => state.wallet.isWrongNetwork
    );
    const networkId = useSelector((state: RootState) => state.wallet.networkId);

    const modalMenu = useComponentVisible(false);
    const walletMenu = useComponentVisible(false);
    const [walletAddress, setWalletAddress] = useState("");
    const [walletIcon, setWalletIcon] = useState("");

    const disconnectWallet = () => {
        walletMenu.setVisible(false);
        connectWallet();
    };

    const toggleWalletMenuVisible = () => {
        walletMenu.setVisible(!walletMenu.visible);
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
                    modalMenu.setVisible(false);
                }
            } else {
                setWalletAddress("");
                modalMenu.setVisible(false);
            }
        }

        init();
    }, [connectedWallet?.wallet?.api, connectedWallet]);

    const ConnectedButton = () => {
        return (
            <div
                className="rounded-lg background h-full flex items-center justify-center px-5 cursor-pointer"
                onClick={() => toggleWalletMenuVisible()}
            >
                {walletIcon ? (
                    <>
                        <img
                            src={walletIcon}
                            className="wallet-icon"
                            alt="wallet icon"
                        ></img>
                        <p className="wallet-addr">
                            {networkId === 0 ? "(testnet) " : ""}
                            {walletAddress}
                        </p>
                    </>
                ) : (
                    <div className="wallet-info">
                        Connecting <Spinner></Spinner>
                    </div>
                )}
            </div>
        );
    };

    const NotConnectedButton = () => (
        <div
            className="rounded-lg background h-full flex items-center justify-center px-5 cursor-pointer"
            onClick={() =>
                dispatch(
                    showModal({
                        modalType: ModalTypes.wallet,
                        details: {
                            content: "hello",
                        },
                    })
                )
            }
        >
            <p>Connect</p>
        </div>
    );

    const WrongNetworkButton = () => (
        <div
            className={
                "rounded-lg background h-full flex items-center justify-center px-5 cursor-pointer"
            }
            onClick={() => toggleWalletMenuVisible()}
        >
            <p>WRONG NETWORK</p>
        </div>
    );

    return (
        <div className="relative h-full">
            {/* <WalletSelectorModal
                visibilityRef={modalMenu.ref}
                modalVisible={modalMenu.visible}
                setModalVisible={modalMenu.setVisible}
                connectWallet={connectWallet}
            /> */}
            {isWrongNetwork ? (
                <WrongNetworkButton />
            ) : connectedWallet?.wallet?.api ? (
                <ConnectedButton />
            ) : (
                <NotConnectedButton />
            )}
            {/* <div
                ref={walletMenu.ref}
                className={
                    "wallet-menu" +
                    (connectedWallet?.wallet?.api && walletMenu.visible
                        ? ""
                        : " hidden")
                }
            >
                <p onClick={disconnectWallet}>
                    <FontAwesomeIcon icon={faLinkSlash} />
                    Disconnect
                </p>
            </div> */}
        </div>
    );
}

export default WalletSelector;

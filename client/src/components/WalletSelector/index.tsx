import { faLinkSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "src/components/Spinner";
import useComponentVisible from "src/hooks/useComponentVisible";
import { RootState } from "src/store";
import { WalletKeys } from "../../services/connectors/wallet.connector";
import { abbreviateAddress } from "../../services/utils.services";
import { showModal } from "src/reducers/globalSlice";
import { ModalTypes } from "src/entities/common.entities";

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

    const disconnectButtonMenu = useComponentVisible(false);
    const [walletAddress, setWalletAddress] = useState("");
    const [walletIcon, setWalletIcon] = useState("");

    const disconnectWallet = () => {
        disconnectButtonMenu.setVisible(false);
        connectWallet();
    };

    const toggleDisconnectButton = () => {
        disconnectButtonMenu.setVisible(!disconnectButtonMenu.visible);
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
                }
            } else {
                setWalletAddress("");
            }
        }

        init();
    }, [connectedWallet?.wallet?.api, connectedWallet]);

    const ConnectedButton = () => {
        return (
            <div
                className="rounded-lg background h-full flex items-center justify-center px-5 cursor-pointer"
                onClick={() => toggleDisconnectButton()}
            >
                {walletIcon ? (
                    <>
                        <img
                            src={walletIcon}
                            className="h-5 mr-3"
                            alt="wallet icon"
                        ></img>
                        <p>
                            {networkId === 0 ? "(testnet) " : ""}
                            {walletAddress}
                        </p>
                    </>
                ) : (
                    <div className="flex flex-row items-center">
                        Connecting{" "}
                        <div className="ml-3">
                            <Spinner></Spinner>
                        </div>
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
            onClick={() => toggleDisconnectButton()}
        >
            <p>WRONG NETWORK</p>
        </div>
    );

    return (
        <div className="relative h-full text">
            {isWrongNetwork ? (
                <WrongNetworkButton />
            ) : connectedWallet?.wallet?.api ? (
                <ConnectedButton />
            ) : (
                <NotConnectedButton />
            )}
            <div
                ref={disconnectButtonMenu.ref}
                className={
                    "absolute top-14 w-full background py-2.5 px-5 rounded-lg cursor-pointer" +
                    (connectedWallet?.wallet?.api &&
                    disconnectButtonMenu.visible
                        ? ""
                        : " hidden")
                }
            >
                <p onClick={disconnectWallet}>
                    <FontAwesomeIcon className="mr-3" icon={faLinkSlash} />
                    Disconnect
                </p>
            </div>
        </div>
    );
}

export default WalletSelector;

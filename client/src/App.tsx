import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    connectWallet as connectWalletRedux,
    setIsWrongNetwork,
    setNetworkId,
} from "src/reducers/walletSlice";
import ModalComponent from "./components/modal/modal.component";
import { ModalTypes } from "./entities/common.entities";
import Header from "./layouts/header.layout";
import Menu from "./layouts/menu.layout";
import Page from "./layouts/page.layout";
import { showModal } from "./reducers/modalSlice";
import { RootState } from "src/store";
import WalletApi, {
    Cardano,
    CIP0030Wallet,
    WalletKeys,
} from "./services/connectors/wallet.connector";
import { getNetworkId } from "./services/claim.services";
import "./styles.scss";

function App() {
    const dispatch = useDispatch();

    const connectedWallet = useSelector(
        (state: RootState) => state.wallet.walletApi
    );
    const networkId = useSelector((state: RootState) => state.wallet.networkId);
    const theme = useSelector((state: RootState) => state.global.theme);

    const connectWallet = useCallback(
        async (walletKey?: WalletKeys) => {
            if (walletKey) {
                if (connectedWallet && typeof networkId !== "undefined") {
                    await connectedWallet
                        .enable(walletKey)
                        .then(async (_api) => {
                            if (_api) {
                                if (typeof _api !== "string") {
                                    const connectedWalletNetworkId = {
                                        network: await _api.getNetworkId(),
                                    };
                                    if (
                                        connectedWalletNetworkId.network ===
                                        networkId
                                    ) {
                                        dispatch(setIsWrongNetwork(false));
                                    } else {
                                        dispatch(setIsWrongNetwork(true));
                                    }
                                    const connectedWalletUpdate: CIP0030Wallet =
                                        {
                                            ...window.cardano[
                                                WalletKeys[walletKey]
                                            ],
                                            api: _api,
                                        };
                                    const walletApi = await getWalletApi(
                                        connectedWalletUpdate
                                    );
                                    dispatch(connectWalletRedux(walletApi));
                                    localStorage.setItem(
                                        "wallet-provider",
                                        walletKey
                                    );
                                } else {
                                    dispatch(
                                        showModal({
                                            text: _api,
                                            type: ModalTypes.info,
                                        })
                                    );
                                }
                            }
                        });
                }
            } else {
                if (connectedWallet?.wallet?.api) {
                    const walletApi = await getWalletApi();
                    dispatch(connectWalletRedux(walletApi));
                    dispatch(setIsWrongNetwork(false));
                    localStorage.setItem("wallet-provider", "");
                }
            }
        },
        [connectedWallet, dispatch, networkId]
    );

    const getWalletApi = async (
        walletApi?: CIP0030Wallet
    ): Promise<WalletApi> => {
        const S = await Cardano();
        const api = new WalletApi(S, walletApi);
        return api;
    };

    /**
     * handles wallet
     */
    useEffect(() => {
        const initWallet = async () => {
            if (!connectedWallet) {
                const walletApi = await getWalletApi();
                dispatch(connectWalletRedux(walletApi));
            } else if (!connectedWallet.wallet) {
                const walletKey = localStorage.getItem("wallet-provider");
                connectWallet(walletKey as WalletKeys);
            }
        };

        initWallet();
    }, [connectWallet, dispatch, connectedWallet]);

    /**
     * handles network id
     */
    useEffect(() => {
        const initNetworkId = async () => {
            const networkIdResponse = await getNetworkId();
            dispatch(setNetworkId(networkIdResponse.network));
        };

        initNetworkId();
    }, [dispatch]);

    return (
        <div className={theme}>
            <ModalComponent />
            <Menu />
            <div className="body">
                <Header connectWallet={connectWallet} />
                <Page />
            </div>
        </div>
    );
}

export default App;

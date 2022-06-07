import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    connectWallet as connectWalletRedux,
    setIsWrongNetwork,
    setNetworkId,
} from "src/reducers/walletSlice";
import ModalComponent from "./components/modal/modal.component";
import { ModalTypes, NetworkId } from "./entities/common.entities";
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

export const Themes = {
    light: "theme-light",
    dark: "theme-dark",
};

function App() {
    const dispatch = useDispatch();

    const connectedWallet = useSelector(
        (state: RootState) => state.wallet.walletApi
    );

    const networkId = useSelector((state: RootState) => state.wallet.networkId);

    const [showMenu, setShowMenu] = useState(false);
    const [theme, setTheme] = useState(Themes.dark);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const toggleTheme = () => {
        setTheme((theme) => {
            const newTheme = theme === Themes.dark ? Themes.light : Themes.dark;
            localStorage.setItem("theme", newTheme);
            return newTheme;
        });
    };

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

    useEffect(() => {
        async function init() {
            if (!connectedWallet) {
                const walletApi = await getWalletApi();
                dispatch(connectWalletRedux(walletApi));
            } else if (!connectedWallet.wallet) {
                const walletKey = localStorage.getItem("wallet-provider");
                connectWallet(walletKey as WalletKeys);
            }
        }

        init();
    }, [connectWallet, dispatch, connectedWallet]);

    useEffect(() => {
        const initNetworkId = async () => {
            const networkIdResponse = await getNetworkId();
            dispatch(setNetworkId(networkIdResponse.network));
        };

        const newTheme = localStorage.getItem("theme");
        if (newTheme) {
            setTheme(newTheme);
        }
        initNetworkId();
    }, [dispatch]);

    return (
        <div className={theme}>
            <ModalComponent />
            <Menu showMenu={showMenu} setShowMenu={setShowMenu} />
            <div className="body">
                <Header
                    connectWallet={connectWallet}
                    toggleMenu={toggleMenu}
                    toggleTheme={toggleTheme}
                />
                <Page />
            </div>
        </div>
    );
}

export default App;

import { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { connectWallet as connectWalletRedux } from "src/reducers/walletSlice";
import ModalComponent, { ModalTypes } from "./components/modal/modal.component";
import Header from "./layouts/header.layout";
import Menu from "./layouts/menu.layout";
import Page from "./layouts/page.layout";
import WalletApi, {
    Cardano,
    CIP0030Wallet,
    WalletKeys,
} from "./services/connectors/wallet.connector";
import "./styles.scss";

export const Themes = {
    light: "theme-light",
    dark: "theme-dark",
};

function App() {
    const dispatch = useDispatch();

    const [showMenu, setShowMenu] = useState(false);
    const [theme, setTheme] = useState(Themes.dark);
    const [connectedWallet, setConnectedWallet] = useState<WalletApi>();
    const [modalVisible, setModalVisible] = useState(false);
    const [modalText, setModalText] = useState<string>("");

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const toggleTheme = () => {
        setTheme((theme) => {
            const newTheme = theme === Themes.dark ? Themes.light : Themes.dark;
            localStorage.setItem('theme', newTheme);
            return newTheme;
        });
    };

    const showModal = (text: string) => {
        setModalText(text);
        setModalVisible(true);
    };

    const connectWallet = useCallback(async (walletKey?: WalletKeys) => {
        if (walletKey) {
            if (connectedWallet) {
                await connectedWallet.enable(walletKey).then(async (_api) => {
                    if (_api) {
                        if (typeof _api !== "string") {
                            const connectedWalletUpdate: CIP0030Wallet = {
                                ...window.cardano[WalletKeys[walletKey]],
                                api: _api,
                            };
                            const walletApi = await getWalletApi(
                                connectedWalletUpdate
                            );
                            dispatch(connectWalletRedux(walletApi));
                            localStorage.setItem('wallet-provider', walletKey);
                            setConnectedWallet(walletApi);
                        } else {
                            showModal(_api);
                        }
                    }
                });
            }
        } else {
            if (connectedWallet) {
                const walletApi = await getWalletApi();
                dispatch(connectWalletRedux(walletApi));
                setConnectedWallet(walletApi);
            }
        }
    }, [connectedWallet, dispatch]);

    const getWalletApi = async (
        walletApi?: CIP0030Wallet
    ): Promise<WalletApi> => {
        const S = await Cardano();
        const api = new WalletApi(
            S,
            walletApi,
            "mainnetRhGqfpK8V1F0qIri9ElcQxBg2cFplyme"
        );
        return api;
    };

    useEffect(() => {
        async function init() {            
            const walletKey = localStorage.getItem('wallet-provider');
            if (!walletKey) {
                const walletApi = await getWalletApi();
                dispatch(connectWalletRedux(walletApi));
                setConnectedWallet(walletApi);
            } else {
                connectWallet(walletKey as WalletKeys);
            }
        }

        init();
    }, [setConnectedWallet, connectWallet]);

    useEffect(() => {
        const newTheme = localStorage.getItem('theme');
        if (newTheme) {
            setTheme(newTheme);
        }
    });

    return (
        <div className={theme}>
            <ModalComponent
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                modalText={modalText}
                modalType={ModalTypes.info}
            />
            <Menu showMenu={showMenu} setShowMenu={setShowMenu} />
            <div className="body">
                <Header
                    connectedWallet={connectedWallet}
                    connectWallet={connectWallet}
                    toggleMenu={toggleMenu}
                    toggleTheme={toggleTheme}
                />
                <Page connectedWallet={connectedWallet} showModal={showModal} />
            </div>
        </div>
    );
}

export default App;

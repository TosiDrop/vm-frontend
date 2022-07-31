import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    connectWallet as connectWalletRedux,
    setNetworkId,
} from "src/reducers/walletSlice";
import Modal from "src/components/Modal";
import Header from "./layouts/header.layout";
import Menu from "./layouts/menu.layout";
import Page from "./layouts/page.layout";
import { RootState } from "src/store";
import { WalletKeys } from "./services/connectors/wallet.connector";
import { getNetworkId } from "./services/claim.services";
import useWallet from "./hooks/useWallet";
import MobileMenu from "src/components/MobileMenu";
import "./styles.scss";
import WalletModal from "./components/WalletModal";

function App() {
    const dispatch = useDispatch();
    const theme = useSelector((state: RootState) => state.global.theme);

    const { connectWallet, getWalletApi } = useWallet();

    /**
     * run on mount, hence disabling eslint
     */
    useEffect(() => {
        const init = async () => {
            /**
             * get network id first
             */
            const networkIdResponse = await getNetworkId();
            dispatch(setNetworkId(networkIdResponse.network));

            /**
             * then init wallet
             */
            const walletKey = localStorage.getItem("wallet-provider");

            if (walletKey) {
                connectWallet(walletKey as WalletKeys);
            } else {
                const walletApi = await getWalletApi();
                dispatch(connectWalletRedux(walletApi));
            }
        };
        init();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={`${theme} w-full`}>
            <MobileMenu />
            <Modal />
            <WalletModal />
            <Menu />
            <div className="body">
                <Header />
                <Page />
            </div>
        </div>
    );
}

export default App;

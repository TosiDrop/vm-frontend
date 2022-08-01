import { useDispatch, useSelector } from "react-redux";
import { ModalTypes, InfoModalTypes } from "src/entities/common.entities";
import { showModal } from "src/reducers/globalSlice";
import {
    connectWallet as connectWalletRedux,
    setIsWrongNetwork,
} from "src/reducers/walletSlice";
import { getNetworkId } from "src/services/claim.services";
import WalletApi, {
    Cardano,
    WalletKeys,
    CIP0030Wallet,
} from "src/services/connectors/wallet.connector";
import { RootState } from "src/store";

const useWallet = () => {
    const dispatch = useDispatch();
    const networkId = useSelector((state: RootState) => state.wallet.networkId);

    const getWalletApi = async (
        walletApi?: CIP0030Wallet
    ): Promise<WalletApi> => {
        const S = await Cardano();
        const api = new WalletApi(S, walletApi);
        return api;
    };

    const connectWallet = async (walletKey?: WalletKeys) => {
        const walletApi = await getWalletApi();

        if (!walletKey) {
            dispatch(connectWalletRedux(walletApi));
            dispatch(setIsWrongNetwork(false));
            localStorage.removeItem("wallet-provider");
            return;
        }

        let localNetworkId = networkId;
        /**
         * only happens on first render
         * the value isnt in redux yet
         * TODO: find out solution on late redux value
         */
        if (localNetworkId == null)
            localNetworkId = (await getNetworkId()).network;

        let connectedWalletApi = await walletApi.enable(walletKey);
        if (connectedWalletApi == null) return;

        if (typeof connectedWalletApi !== "string") {
            const connectedWalletNetworkId = {
                network: await connectedWalletApi.getNetworkId(),
            };

            if (connectedWalletNetworkId.network === localNetworkId) {
                dispatch(setIsWrongNetwork(false));
            } else {
                dispatch(setIsWrongNetwork(true));
            }
            const connectedWalletUpdate: CIP0030Wallet = {
                ...window.cardano[WalletKeys[walletKey]],
                api: connectedWalletApi,
            };
            const walletApi = await getWalletApi(connectedWalletUpdate);
            dispatch(connectWalletRedux(walletApi));
            localStorage.setItem("wallet-provider", walletKey);
        } else {
            dispatch(
                showModal({
                    modalType: ModalTypes.info,
                    details: {
                        text: connectedWalletApi,
                        type: InfoModalTypes.info,
                    },
                })
            );
        }
    };

    return {
        connectWallet: connectWallet,
        getWalletApi: getWalletApi,
    };
};

export default useWallet;

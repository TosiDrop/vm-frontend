import { Cip30Wallet, WalletApi } from "@cardano-sdk/cip30";
import { useDispatch } from "react-redux";
import { CardanoTypes } from "src/entities/cardano";
import {
  connectWallet as connectWalletRedux,
  setIsWrongNetwork,
  setNetworkId,
  setWalletState,
} from "src/reducers/walletSlice";
import { getBech32Address, getNetworkId } from "src/services/common";

declare global {
  interface Window {
    cardano: Record<CardanoTypes.WalletKeys, Cip30Wallet>;
  }
}

const useWallet = () => {
  const dispatch = useDispatch();

  const connectWallet = async (walletKey?: CardanoTypes.WalletKeys) => {
    if (!walletKey) {
      dispatch(connectWalletRedux());
      dispatch(setIsWrongNetwork(false));
      localStorage.removeItem("wallet-provider");
      dispatch(setWalletState(CardanoTypes.WalletState.notConnected));
      return;
    }

    dispatch(setWalletState(CardanoTypes.WalletState.connecting));

    const networkId = await getNetworkId();

    const cardanoApi = window.cardano;
    const connectedWallet = cardanoApi[walletKey];
    const connectedWalletApi = await connectedWallet.enable();

    const connectedWalletApiNetworkId =
      (await connectedWalletApi.getNetworkId()) as unknown as CardanoTypes.NetworkId;

    const addressInBech32 = await getWalletAddressInBech32(connectedWalletApi);

    dispatch(setNetworkId(networkId));
    dispatch(
      connectWalletRedux({
        wallet: connectedWallet,
        walletApi: connectedWalletApi,
        walletAddress: addressInBech32,
      })
    );
    localStorage.setItem("wallet-provider", walletKey);

    if (connectedWalletApiNetworkId === networkId) {
      dispatch(setIsWrongNetwork(false));
      dispatch(setWalletState(CardanoTypes.WalletState.connected));
    } else {
      dispatch(setIsWrongNetwork(true));
      dispatch(setWalletState(CardanoTypes.WalletState.wrongNetwork));
    }
  };

  const getWalletAddressInBech32 = async (
    walletApi: WalletApi
  ): Promise<string> => {
    if (walletApi == null) {
      return "";
    }
    const addresses = await walletApi?.getUsedAddresses();
    const address = addresses[0];

    const addressInBech32 = await getBech32Address({
      addressInHex: address,
    });

    return addressInBech32;
  };

  return {
    connectWallet,
  };
};

export default useWallet;

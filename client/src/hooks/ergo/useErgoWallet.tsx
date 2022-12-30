import { useDispatch } from "react-redux";
import {
  ErgoWalletApi,
  ErgoWalletName,
  NautilusErgoWalletApi,
} from "src/entities/ergo";
import { setErgoWallet } from "src/reducers/walletSlice";
import { ERROR_MESSAGE } from "src/utils/error";

type ErgoConnector = any;

export default function useErgoWallet() {
  const dispatch = useDispatch();

  const connectWallet = async (walletName: ErgoWalletName) => {
    /** Recommended by nautilus to use window.ergoConnector */
    const ergoConnector: ErgoConnector = (window as any).ergoConnector;
    if (ergoConnector == null)
      throw new Error(ERROR_MESSAGE.ergo_no_wallet_detected);

    let ergoApi: ErgoWalletApi | null = null;

    switch (walletName) {
      case ErgoWalletName.nautilus:
        ergoApi = await connectNautilus(ergoConnector);
        break;
      default:
        throw new Error(ERROR_MESSAGE.ergo_wallet_not_supported);
    }

    dispatch(setErgoWallet(ergoApi));
  };

  const disconnectWallet = () => {
    dispatch(setErgoWallet(null));
  };

  const connectNautilus = async (
    ergoConnector: ErgoConnector
  ): Promise<NautilusErgoWalletApi> => {
    const nautilus = ergoConnector.nautilus;
    if (nautilus == null)
      throw new Error(ERROR_MESSAGE.ergo_nautilus_not_found);
    const nautilusConnected = await nautilus.connect();
    if (nautilusConnected == null)
      throw new Error(ERROR_MESSAGE.ergo_nautilus_connect_fail);
    const walletApi = await nautilus.getContext();
    return walletApi;
  };

  return {
    connectWallet,
    disconnectWallet,
  };
}

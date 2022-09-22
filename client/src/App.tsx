import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  connectWallet as connectWalletRedux,
  setNetworkId,
} from "src/reducers/walletSlice";
import Modal from "src/components/Modal";
import Header from "src/components/Header";
import Router from "src/layouts/router";
import { RootState } from "src/store";
import { WalletKeys } from "src/services/connectors/wallet.connector";
import { getNetworkId } from "src/services/common";
import useWallet from "src/hooks/useWallet";
import "src/styles.scss";
import Footer from "./components/Footer";

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
    <div className={`app ${theme}`}>
      <div className="w-full text flex flex-col items-center">
        <Modal />
        <Header />
        <Router />
        <Footer></Footer>
      </div>
    </div>
  );
}

export default App;

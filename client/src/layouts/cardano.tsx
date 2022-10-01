import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Header from "src/components/Header";
import { WalletConnector } from "src/entities/common.entities";

import useWallet from "src/hooks/useWallet";
import {
  connectWallet as connectWalletRedux,
  setNetworkId,
} from "src/reducers/walletSlice";
import { getNetworkId } from "src/services/common";
import { WalletKeys } from "src/services/connectors/wallet.connector";

interface Props {
  children: JSX.Element;
}

export default function Cardano({ children }: Props) {
  const dispatch = useDispatch();
  const { getWalletApi, connectWallet } = useWallet();
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
    <>
      <Header walletConnector={WalletConnector.cardano}></Header>
      {children}
    </>
  );
}

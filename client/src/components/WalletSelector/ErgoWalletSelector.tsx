import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NautilusUrl from "src/assets/nautilus.svg";
import {
  ModalTypes,
  WalletInfo,
  WalletState,
} from "src/entities/common.entities";
import useErgoWallet from "src/hooks/ergo/useErgoWallet";
import { showModal } from "src/reducers/globalSlice";
import { RootState } from "src/store";
import { abbreviateAddress } from "src/utils";
import WalletSelector from "./WalletSelector";

export default function ErgoWalletSelector() {
  const dispatch = useDispatch();
  const connectedWallet = useSelector(
    (state: RootState) => state.wallet.ergoWalletApi
  );
  const { connectWallet, disconnectWallet } = useErgoWallet();
  const walletInfoNotConnected = {
    address: "",
    iconUrl: "",
    isApiConnected: false,
  };
  const [walletInfo, setWalletInfo] = useState<WalletInfo>(
    walletInfoNotConnected
  );
  const [walletState, setWalletState] = useState<WalletState>(
    WalletState.notConnected
  );

  useEffect(() => {
    (async () => {
      if (connectedWallet == null) {
        setWalletState(WalletState.notConnected);
        setWalletInfo(walletInfoNotConnected);
      } else {
        setWalletState(WalletState.connecting);
        const address = await connectedWallet?.get_change_address();
        setWalletState(WalletState.connected);
        setWalletInfo({
          address: abbreviateAddress(address),
          iconUrl: NautilusUrl,
          isApiConnected: true,
        });
      }
    })();
  }, [connectedWallet]);

  const showWalletSelection = () => {
    dispatch(
      showModal({
        modalType: ModalTypes.ergoWallet,
      })
    );
  };

  return (
    <WalletSelector
      disconnectWallet={disconnectWallet}
      showWalletSelection={showWalletSelection}
      walletState={walletState}
      walletInfo={walletInfo}
    ></WalletSelector>
  );
}

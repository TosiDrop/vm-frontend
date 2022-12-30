import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ModalTypes,
  WalletInfo,
  WalletState,
} from "src/entities/common.entities";
import useWallet from "src/hooks/useWallet";
import { showModal } from "src/reducers/globalSlice";
import { RootState } from "src/store";
import { abbreviateAddress } from "src/utils";
import WalletSelector from "./WalletSelector";

function CardanoWalletSelector() {
  const { connectWallet } = useWallet();
  const walletInfoNotConnected: WalletInfo = useMemo(
    () => ({
      address: "",
      iconUrl: "",
      isApiConnected: false,
    }),
    []
  );

  const dispatch = useDispatch();
  const connectedWallet = useSelector(
    (state: RootState) => state.wallet.walletApi
  );
  const isWrongNetwork = useSelector(
    (state: RootState) => state.wallet.isWrongNetwork
  );

  const [walletState, setWalletState] = useState<WalletState>(
    WalletState.notConnected
  );
  const [walletInfo, setWalletInfo] = useState<WalletInfo>(
    walletInfoNotConnected
  );

  useEffect(() => {
    async function init() {
      if (connectedWallet?.wallet?.api) {
        /** if wallet is connected */
        try {
          setWalletState(WalletState.connecting);
          const addr = abbreviateAddress(await connectedWallet.getAddress());
          setWalletInfo({
            address: addr,
            iconUrl: connectedWallet.wallet.icon,
            isApiConnected: true,
          });
          if (isWrongNetwork) {
            setWalletState(WalletState.wrongNetwork);
          } else {
            setWalletState(WalletState.connected);
          }
        } catch (e) {
          setWalletState(WalletState.notConnected);
        }
      } else {
        /** if no wallet connected */
        setWalletInfo(walletInfoNotConnected);
        setWalletState(WalletState.notConnected);
      }
    }
    init();
  }, [connectedWallet]);

  const showWalletSelection = () => {
    dispatch(
      showModal({
        modalType: ModalTypes.wallet,
      })
    );
  };

  return (
    <WalletSelector
      disconnectWallet={() => connectWallet()}
      showWalletSelection={showWalletSelection}
      walletState={walletState}
      walletInfo={walletInfo}
    ></WalletSelector>
  );
}

export default CardanoWalletSelector;

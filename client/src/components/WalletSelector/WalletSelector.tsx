import { useSelector } from "react-redux";
import { CardanoTypes } from "src/entities/cardano";
import { WalletInfo } from "src/entities/common.entities";
import { RootState } from "src/store";
import Connect from "./Connect";
import Connected from "./Connected";
import WrongNetwork from "./WrongNetwork";

interface Props {
  disconnectWallet: () => void;
  showWalletSelection: () => void;
  walletState?: CardanoTypes.WalletState;
  walletInfo?: WalletInfo;
}

function WalletSelector({ disconnectWallet, showWalletSelection }: Props) {
  const walletState = useSelector(
    (state: RootState) => state.wallet.walletState,
  );

  switch (walletState) {
    case CardanoTypes.WalletState.connecting:
    case CardanoTypes.WalletState.connected:
      return (
        <Connected
          connecting={walletState === CardanoTypes.WalletState.connecting}
          disconnectWallet={disconnectWallet}
        ></Connected>
      );
    case CardanoTypes.WalletState.wrongNetwork:
      return <WrongNetwork disconnectWallet={disconnectWallet}></WrongNetwork>;
    case CardanoTypes.WalletState.notConnected:
    default:
      return <Connect onClick={showWalletSelection}></Connect>;
  }
}

export default WalletSelector;

import { WalletInfo, WalletState } from "src/entities/common.entities";
import Connect from "./Connect";
import Connected from "./Connected";
import WrongNetwork from "./WrongNetwork";

interface Props {
  disconnectWallet: () => void;
  showWalletSelection: () => void;
  walletState: WalletState;
  walletInfo: WalletInfo;
}

function WalletSelector({
  disconnectWallet,
  showWalletSelection,
  walletState,
  walletInfo,
}: Props) {
  switch (walletState) {
    case WalletState.connecting:
    case WalletState.connected:
      return (
        <Connected
          address={walletInfo.address}
          connecting={walletState === WalletState.connecting}
          iconUrl={walletInfo.iconUrl}
          prefix={walletInfo.prefix ?? ""}
          disconnectWallet={disconnectWallet}
        ></Connected>
      );
    case WalletState.wrongNetwork:
      return <WrongNetwork disconnectWallet={disconnectWallet}></WrongNetwork>;
    case WalletState.notConnected:
    default:
      return <Connect onClick={showWalletSelection}></Connect>;
  }
}

export default WalletSelector;

import { useSelector } from "react-redux";
import useComponentVisible from "src/hooks/useComponentVisible";
import { RootState } from "src/store";
import { abbreviateAddress } from "src/utils";
import Spinner from "../Spinner";
import Disconnect from "./Disconnect";

export default function Connected({
  connecting,
  disconnectWallet,
}: {
  connecting: boolean;
  disconnectWallet: () => void;
}) {
  const { wallet: connectedWallet, walletAddress: connectedWalletAddress } =
    useSelector((state: RootState) => state.wallet);

  const disconnectButtonMenu = useComponentVisible(false);

  const toggleDisconnectButton = () => {
    disconnectButtonMenu.setVisible(!disconnectButtonMenu.visible);
  };

  return (
    <div className="relative w-fit">
      <div
        className="rounded-lg background flex items-center justify-center px-5 py-2.5 cursor-pointer flex items-center gap-2"
        onClick={toggleDisconnectButton}
      >
        {connecting ? (
          <div className="flex flex-row items-center gap-2">
            Connecting
            <Spinner></Spinner>
          </div>
        ) : (
          <>
            {connectedWallet ? (
              <img
                src={connectedWallet.icon}
                className="h-5"
                alt="wallet icon"
              ></img>
            ) : null}
            <p>{abbreviateAddress(connectedWalletAddress)}</p>
          </>
        )}
      </div>
      <Disconnect
        ref={disconnectButtonMenu.ref}
        isShown={disconnectButtonMenu.visible}
        onClick={disconnectWallet}
      ></Disconnect>
    </div>
  );
}

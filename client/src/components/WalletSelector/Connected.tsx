import useComponentVisible from "src/hooks/useComponentVisible";
import { abbreviateAddress } from "src/utils";
import Spinner from "../Spinner";
import Disconnect from "./Disconnect";
import { useWalletConnector } from "src/pages/Cardano/Claim/useWalletConnector";

export default function Connected({
  connecting,
  disconnectWallet,
}: {
  connecting: boolean;
  disconnectWallet: () => void;
}) {
  const { wallet, address } = useWalletConnector();

  const disconnectButtonMenu = useComponentVisible(false);

  const toggleDisconnectButton = () => {
    disconnectButtonMenu.setVisible(!disconnectButtonMenu.visible);
  };

  return (
    <div className="relative w-fit">
      <div
        className="rounded-lg background flex items-center justify-center px-5 py-2.5 cursor-pointer gap-2"
        onClick={toggleDisconnectButton}
      >
        {connecting ? (
          <div className="flex flex-row items-center gap-2">
            Connecting
            <Spinner></Spinner>
          </div>
        ) : (
          <>
            {wallet ? (
              <img src={wallet.icon} className="h-5" alt="wallet icon"></img>
            ) : null}
            <p>{address ? abbreviateAddress(address) : ""}</p>
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

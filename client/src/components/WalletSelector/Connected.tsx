import useComponentVisible from "src/hooks/useComponentVisible";
import Spinner from "../Spinner";
import Disconnect from "./Disconnect";

export default function Connected({
  address,
  connecting,
  iconUrl,
  prefix,
  disconnectWallet,
}: {
  address: string;
  connecting: boolean;
  iconUrl?: string;
  prefix?: string;
  disconnectWallet: () => void;
}) {
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
            {iconUrl ? (
              <img src={iconUrl} className="h-5" alt="wallet icon"></img>
            ) : null}
            <p>
              {prefix}
              {address}
            </p>
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

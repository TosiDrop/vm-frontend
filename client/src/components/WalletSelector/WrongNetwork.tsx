import useComponentVisible from "src/hooks/useComponentVisible";
import Disconnect from "./Disconnect";

export default function WrongNetwork({
  disconnectWallet,
}: {
  disconnectWallet: () => void;
}) {
  const disconnectButtonMenu = useComponentVisible(false);

  const toggleDisconnectButton = () => {
    disconnectButtonMenu.setVisible(!disconnectButtonMenu.visible);
  };

  return (
    <div className="relative w-fit">
      <div
        className={
          "relative rounded-lg background flex items-center justify-center px-5 py-2.5 cursor-pointer"
        }
        onClick={toggleDisconnectButton}
      >
        <p>WRONG NETWORK</p>
      </div>
      <Disconnect
        ref={disconnectButtonMenu.ref}
        isShown={disconnectButtonMenu.visible}
        onClick={disconnectWallet}
      ></Disconnect>
    </div>
  );
}

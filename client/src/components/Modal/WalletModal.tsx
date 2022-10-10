import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch } from "react-redux";
import useWallet from "src/hooks/useWallet";
import { hideModal } from "src/reducers/globalSlice";
import { WalletKeys } from "src/services/connectors/wallet.connector";

export const WalletModal = () => {
  const dispatch = useDispatch();
  const { connectWallet } = useWallet();

  return (
    <>
      <div className="w-full flex flex-row items-center">
        Connect Wallet
        <div
          className="ml-auto cursor-pointer"
          onClick={() => dispatch(hideModal())}
        >
          <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
        </div>
      </div>
      <div className="w-full flex flex-col gap-4">
        {window.cardano ? (
          Object.keys(WalletKeys).map((key) => {
            if (window.cardano && window.cardano[key]) {
              const walletKey = key as WalletKeys;
              return (
                <div
                  key={key}
                  className="w-full flex flex-row items-center cursor-pointer rounded-lg border-gray-400 border p-2.5"
                  onClick={() => {
                    dispatch(hideModal());
                    connectWallet(walletKey);
                  }}
                >
                  {window.cardano[key].name.charAt(0).toUpperCase() +
                    window.cardano[key].name.slice(1)}
                  <img
                    className="ml-auto h-6"
                    src={window.cardano[key].icon}
                    alt="wallet"
                  ></img>
                </div>
              );
            } else {
              return null;
            }
          })
        ) : (
          <div className="w-full flex flex-row items-center rounded-lg border-gray-400 border p-2.5">
            No wallet found :(
          </div>
        )}
      </div>
    </>
  );
};

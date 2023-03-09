import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch } from "react-redux";
import { CardanoTypes } from "src/entities/cardano";
import useWallet from "src/hooks/useWallet";
import { hideModal } from "src/reducers/globalSlice";

export const WalletModal = () => {
  const dispatch = useDispatch();
  const { connectWallet } = useWallet();
  const cardanoApi = window.cardano;

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
        {cardanoApi ? (
          Object.keys(CardanoTypes.WalletKeys).map((key) => {
            const typedKey = key as CardanoTypes.WalletKeys;
            const wallet = cardanoApi[typedKey];
            if (cardanoApi[typedKey]) {
              return (
                <div
                  key={key}
                  className="w-full flex flex-row items-center cursor-pointer rounded-lg border-gray-400 border p-2.5"
                  onClick={() => {
                    dispatch(hideModal());
                    connectWallet(typedKey);
                  }}
                >
                  {wallet.name.charAt(0).toUpperCase() + wallet.name.slice(1)}
                  <img
                    className="ml-auto h-6"
                    src={wallet.icon}
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

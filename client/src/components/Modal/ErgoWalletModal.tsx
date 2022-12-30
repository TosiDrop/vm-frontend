import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch } from "react-redux";
import { ErgoWalletName, ERGO_WALLET_INFO } from "src/entities/ergo";
import useErgoWallet from "src/hooks/ergo/useErgoWallet";
import { hideModal } from "src/reducers/globalSlice";

export default function ErgoWalletModal() {
  const dispatch = useDispatch();
  const { connectWallet } = useErgoWallet();

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
        {Object.keys(ERGO_WALLET_INFO).map((_) => {
          const key = _ as ErgoWalletName;
          return (
            <div
              key={key}
              className="w-full flex flex-row items-center cursor-pointer rounded-lg border-gray-400 border p-2.5"
              onClick={() => {
                dispatch(hideModal());
                connectWallet(key as ErgoWalletName);
              }}
            >
              {ERGO_WALLET_INFO[key].displayName}
              <img
                className="ml-auto h-6"
                src={ERGO_WALLET_INFO[key].iconUrl}
                alt="wallet"
              ></img>
            </div>
          );
        })}
      </div>
    </>
  );
}

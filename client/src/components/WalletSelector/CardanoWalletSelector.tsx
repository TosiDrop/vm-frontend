import { useDispatch } from "react-redux";
import { ModalTypes } from "src/entities/common.entities";
import useWallet from "src/hooks/useWallet";
import { showModal } from "src/reducers/globalSlice";
import WalletSelector from "./WalletSelector";

function CardanoWalletSelector() {
  const { connectWallet } = useWallet();

  const dispatch = useDispatch();

  const showWalletSelection = () => {
    dispatch(
      showModal({
        modalType: ModalTypes.wallet,
      }),
    );
  };

  return (
    <WalletSelector
      disconnectWallet={() => connectWallet()}
      showWalletSelection={showWalletSelection}
    ></WalletSelector>
  );
}

export default CardanoWalletSelector;

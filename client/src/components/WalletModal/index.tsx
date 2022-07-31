import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheck,
    faInfoCircle,
    faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { hideModal } from "src/reducers/modalSlice";
import { RootState } from "src/store";
import { ModalTypes } from "src/entities/common.entities";

function WalletModal() {
    const dispatch = useDispatch();
    const modalVisible = useSelector((state: RootState) => state.global.showWalletModal);

    return (
        <div
          className={`text z-10 text-modal modal absolute w-full h-full flex items-center justify-center ${
              modalVisible ? "visible" : "invisible"
          }`}
      >
          <div className="modal-background layover absolute w-full h-full"></div>
          <div className="background w-96 p-5 rounded-2xl z-10 flex flex-col items-center">
            Hello
          </div>
      </div>
    );
}

export default WalletModal;

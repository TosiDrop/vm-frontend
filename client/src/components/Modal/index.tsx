import { useDispatch, useSelector } from "react-redux";
import { ModalTypes } from "src/entities/common.entities";
import useClickOutside from "src/hooks/useClickOutside";
import { hideModal } from "src/reducers/globalSlice";
import { RootState } from "src/store";
import { InfoModal } from "./InfoModal";
import { WalletModal } from "./WalletModal";

function Modal() {
    const { showModal } = useSelector((state: RootState) => state.global);
    const ref = useClickOutside(() => dispatch(hideModal()));
    const dispatch = useDispatch();

    const renderModalContent = () => {
        switch (showModal) {
            case ModalTypes.info:
                return <InfoModal />;
            case ModalTypes.wallet:
                return <WalletModal />;
            default:
                return null;
        }
    };

    return showModal != null ? (
        <div
            className={`z-10 text-modal modal absolute w-full h-full flex items-center justify-center`}
        >
            <div className="modal-background layover absolute w-full h-full"></div>
            <div
                className="background w-full max-w-sm m-5 p-5 rounded-2xl z-10 flex flex-col items-center text"
                ref={ref}
            >
                {renderModalContent()}
            </div>
        </div>
    ) : null;
}

export default Modal;

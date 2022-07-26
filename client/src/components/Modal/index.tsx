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

function Modal() {
    const dispatch = useDispatch();
    const modalVisible = useSelector((state: RootState) => state.modal.show);
    const modalText = useSelector((state: RootState) => state.modal.text);
    const modalType = useSelector((state: RootState) => state.modal.type);

    const renderIcon = () => {
        switch (modalType) {
            case ModalTypes.failure:
                return (
                    <div className="m-auto text-center text-failure">
                        <FontAwesomeIcon className="text-3xl" icon={faXmark} />
                    </div>
                );
            case ModalTypes.success:
                return (
                    <div className="m-auto text-center text-success">
                        <FontAwesomeIcon className="text-3xl" icon={faCheck} />
                    </div>
                );
            case ModalTypes.info:
            default:
                return (
                    <div className="m-auto text-center text">
                        <FontAwesomeIcon
                            className="text-3xl"
                            icon={faInfoCircle}
                        />
                    </div>
                );
        }
    };

    return (
        <div
            className={`z-10 text-modal modal absolute w-full h-full flex items-center justify-center ${
                modalVisible ? "visible" : "invisible"
            }`}
        >
            <div className="modal-background layover absolute w-full h-full"></div>
            <div className="background w-96 py-6 rounded-2xl z-10">
                <div className="box">
                    <div className="modal-icon">{renderIcon()}</div>
                    <div className="mt-5 text text-center">{modalText}</div>
                    <div className="text-center mt-5">
                        <button
                            className="tosi-button"
                            onClick={() => dispatch(hideModal())}
                        >
                            Ok
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Modal;

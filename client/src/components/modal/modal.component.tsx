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
import "./modal.component.scss";

function ModalComponent() {
    const dispatch = useDispatch();
    const modalVisible = useSelector((state: RootState) => state.modal.show);
    const modalText = useSelector((state: RootState) => state.modal.text);
    const modalType = useSelector((state: RootState) => state.modal.type);

    const renderIcon = () => {
        switch (modalType) {
            case ModalTypes.failure:
                return (
                    <span className="modal__icon-failure modal__icon ">
                        <FontAwesomeIcon icon={faXmark} />
                    </span>
                );
            case ModalTypes.success:
                return (
                    <span className="modal__icon-success modal__icon ">
                        <FontAwesomeIcon icon={faCheck} />
                    </span>
                );
            case ModalTypes.info:
            default:
                return (
                    <span className="modal__icon-">
                        <FontAwesomeIcon icon={faInfoCircle} />
                    </span>
                );
        }
    };

    return (
        <div
            className={"text-modal modal" + (modalVisible ? " is-active" : "")}
        >
            <div className="modal-background"></div>
            <div className="modal-content">
                <div className="box">
                    <div className="modal-icon">{renderIcon()}</div>
                    <div className="text-content">{modalText}</div>
                    <div className="modal-buttons">
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

export default ModalComponent;

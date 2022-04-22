import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { hideModal } from "src/reducers/modalSlice";
import { RootState } from "src/store";
import "./modal.component.scss";

function ModalComponent() {
    const dispatch = useDispatch();
    const modalVisible = useSelector((state: RootState) => state.modal.show);
    const modalText = useSelector((state: RootState) => state.modal.text);

    const renderSwitch = () => {
        return <FontAwesomeIcon icon={faInfoCircle} />;
        // switch (modalType) {
        //     case ModalTypes.info:
        //         return <FontAwesomeIcon icon={faInfoCircle} />;
        //     default:
        //         return '';
        // }
    };

    return (
        <div
            className={"text-modal modal" + (modalVisible ? " is-active" : "")}
        >
            <div className="modal-background"></div>
            <div className="modal-content">
                <div className="box">
                    <div className="modal-icon">{renderSwitch()}</div>
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

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import './modal.component.scss';

export enum ModalTypes {
    info
}

export interface ModalComponentProps {
    modalVisible: boolean;
    setModalVisible: any;
    modalText: string;
    modalType: ModalTypes;
}

function ModalComponent({ modalVisible, setModalVisible, modalText, modalType }: ModalComponentProps) {

    const hideModal = () => {
        setModalVisible(false);
    }

    const renderSwitch = () => {
        switch (modalType) {
            case ModalTypes.info:
                return <FontAwesomeIcon icon={faInfoCircle} />;
            default:
                return '';
        }
    }

    return (
        <div className={'modal' + (modalVisible ? ' is-active' : '')}>
            <div className="modal-background"></div>
            <div className="modal-content">
                <div className='box'>
                    <div className='modal-icon'>
                        {renderSwitch()}
                    </div>
                    <div className='text-content'>
                        {modalText}
                    </div>
                    <div className='modal-buttons'>
                        <button className="button is-background is-small" onClick={hideModal}>Ok</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalComponent;

    //     <div>
    //     <Modal show={modalVisible} centered={true}>
    //         <Modal.Body>
    //             <div className='modal-icon'>
    //                 {renderSwitch()}
    //             </div>
    //             <div className='text-content'>
    //                 {modalContent}
    //             </div>
    //         </Modal.Body>
    //         <Modal.Footer>
    //             <Button variant="primary" onClick={hideModal}>
    //                 Ok
    //             </Button>
    //         </Modal.Footer>
    //     </Modal>
    // </div>
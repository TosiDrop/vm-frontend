import WalletApi, { WalletKeys } from '../../../services/connectors/wallet.connector';
import './wallet-selector-modal.component.scss';

export interface ModalComponentProps {
    modalVisible: boolean;
    setModalVisible: any;
    connectedWallet: WalletApi | undefined;
    connectWallet: (walletKey?: WalletKeys) => void;
}

function WalletSelectorModalComponent({ modalVisible, setModalVisible, connectedWallet, connectWallet }: ModalComponentProps) {

    const hideModal = () => {
        setModalVisible(false);
    }

    return (
        <div className={'modal' + (modalVisible ? ' is-active' : '')}>
            <div className="modal-background"></div>
            <div className="modal-content">
                <div className='box'>
                    <div className='wallet-modal-head'>
                        <div className='wallet-text-content'>
                            Connect wallet
                        </div>
                        <div className='wallet-modal-buttons'>
                            <button className="button is-wallet-background is-small" onClick={hideModal}>X</button>
                        </div>
                    </div>
                    <div className='wallet-modal-body'>
                        {
                            Object.keys(WalletKeys).map((key) => {
                                if (window.cardano && window.cardano[key]) {
                                    const walletKey = key as WalletKeys;
                                    return (
                                        <div className={'wallet-modal-body-row' + (window.cardano[key] ? '' : ' hidden')} onClick={() => connectWallet(walletKey)}>
                                            <p>{key.charAt(0).toUpperCase() + key.slice(1)}</p>
                                            <img src={window.cardano[key].icon} alt='wallet'></img>
                                        </div>
                                    );
                                }
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WalletSelectorModalComponent;
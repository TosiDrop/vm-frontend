import { faLinkSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import WalletApi, { WalletKeys } from '../../services/connectors/wallet.connector';
import { abbreviateAddress } from '../../services/utils.services';
import WalletSelectorModalComponent from './wallet-selector-modal/wallet-selector-modal.component';
import './wallet-selector.component.scss';

interface Params {
    connectedWallet: WalletApi | undefined;
    connectWallet: (walletKey?: WalletKeys) => void;
}

function WalletSelectorComponent({ connectedWallet, connectWallet }: Params) {
    const [modalVisible, setModalVisible] = useState(false);
    const [walletMenuVisible, setWalletMenuVisible] = useState(false);
    const [walletAddress, setWalletAddress] = useState('');
    const [walletIcon, setWalletIcon] = useState('');

    const disconnectWallet = () => {
        setWalletMenuVisible(false);
        connectWallet();
    }

    const toggleWalletMenuVisible = () => {
        setWalletMenuVisible(!walletMenuVisible);
    }

    useEffect(() => {
        async function init() {
            if (connectedWallet?.wallet?.api) {
                const addr = abbreviateAddress(await connectedWallet.getAddress())
                setWalletAddress(addr);
                setWalletIcon(connectedWallet.wallet.icon);
                setModalVisible(false);
            }
        }

        init();
    }, [connectedWallet?.wallet?.api, connectedWallet]);

    const Connected = () => (
        <div className="wallet-connected" onClick={() => toggleWalletMenuVisible()}>
            <img src={walletIcon} className='wallet-icon' alt='wallet icon'></img>
            <p className='wallet-addr'>{walletAddress}</p>
        </div>
    )

    const NotConnected = () => (
        <div className="wallet-not-connected" onClick={() => setModalVisible(true)}>
            <p>Connect</p>
        </div>
    )

    return (
        <div className='wallet-selector-container'>
            <WalletSelectorModalComponent modalVisible={modalVisible} setModalVisible={setModalVisible} connectedWallet={connectedWallet} connectWallet={connectWallet} />
            <div className='wallet-selector'>
                {connectedWallet?.wallet?.api ? <Connected /> : <NotConnected />}
            </div>
            <div className={'wallet-menu' + (connectedWallet?.wallet?.api && walletMenuVisible ? '' : ' hidden')}>
                <p onClick={disconnectWallet}><FontAwesomeIcon icon={faLinkSlash} />Disconnect</p>
            </div>
        </div>
    )
}

export default WalletSelectorComponent;
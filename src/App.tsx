import { useEffect, useState } from 'react';
import Header from './layouts/header.layout';
import { Menu } from './layouts/menu.layout';
import Page from './layouts/page.layout';
import WalletApi, { Cardano } from './services/wallet/wallet';
import './styles.scss';

function App() {
    const [walletApi, setWalletApi] = useState<WalletApi>();
    const [walletSelected, setWalletSelected] = useState<string>();
    const [address, setAddress] = useState<string>();

    useEffect(() => {
        async function init() {
            const S = await Cardano();
            const api = new WalletApi(
                S,
                window.cardano,
                '',
                'nami'
            );
            setWalletApi(api);
        }

        init();
    }, []);

    useEffect(() => {
        async function setWalletInfo() {
            const address = await walletApi?.getAddress();
            setAddress(address);
        }
        switch (walletSelected) {
            case 'nami':
                setWalletInfo();
                break;
        }
    }, [walletSelected]);

    return (
        <div className='body'>
            <Header wallet={walletApi} setWalletSelected={setWalletSelected} address={address?.substring(0, 8) + '...' + address?.substring(address.length - 4)} />
            <div className="columns">
                <div className="column is-one-fifth">
                    <Menu />
                </div>
                <div className="column">
                    <Page />
                </div>
            </div>
        </div>
    );
}

export default App;

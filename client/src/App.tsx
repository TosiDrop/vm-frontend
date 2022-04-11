import { useEffect, useState } from 'react';
import Header from './layouts/header.layout';
import Menu from './layouts/menu.layout';
import Page from './layouts/page.layout';
import WalletApi, { Cardano, CIP0030Wallet, WalletKeys } from './services/connectors/wallet.connector';
import './styles.scss';

export const Themes = {
    light: 'theme-light',
    dark: 'theme-dark'
}

function App() {
    const [showMenu, setShowMenu] = useState(false);
    const [theme, setTheme] = useState(Themes.dark);
    const [connectedWallet, setConnectedWallet] = useState<WalletApi>();

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    }

    const toggleTheme = () => {
        setTheme(theme => theme === Themes.dark ? Themes.light : Themes.dark);
    }

    const connectWallet = async (walletKey: WalletKeys) => {
        if (connectedWallet) {
            await connectedWallet.enable(walletKey).then(async (_api) => {
                if (_api) {
                    const connectedWalletUpdate: CIP0030Wallet = {
                        ...window.cardano[WalletKeys[walletKey]],
                        api: _api
                    };
                    const walletApi = await getWalletApi(connectedWalletUpdate);
                    setConnectedWallet(walletApi);
                }
                // const walletApi = await getWalletApi(_api);
                // setWalletApi(walletApi);
    
                // const address1: string = await walletApi.getAddress();
                // if (address1.length) {
                //     setSearchAddressAbbr(abbreviateAddress(address1));
                //     const balance = await walletApi.getBalance();
                //     const totalWalletValueAda = formatTokensToNumbers(balance.lovelace, 6);
                //     setTotalWalletValueAda(truncAmount(totalWalletValueAda, 2));
                // }
            });
        }
    }

    const getWalletApi = async (walletApi?: CIP0030Wallet): Promise<WalletApi> => {
        const S = await Cardano();
        const api = new WalletApi(
            S,
            walletApi,
            'mainnetRhGqfpK8V1F0qIri9ElcQxBg2cFplyme'
        );
        return api;
    }

    useEffect(() => {
        async function init() {
            setConnectedWallet(await getWalletApi());
        }

        init();
    }, [setConnectedWallet]);

    return (
        <div className={theme}>
            <Menu showMenu={showMenu} setShowMenu={setShowMenu} />
            <div className='body'>
                <Header connectedWallet={connectedWallet} connectWallet={connectWallet} toggleMenu={toggleMenu} toggleTheme={toggleTheme} />
                <Page />
            </div>
        </div>
    );
}

export default App;

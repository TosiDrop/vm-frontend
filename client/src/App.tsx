import { useState } from 'react';
import Header from './layouts/header.layout';
import Menu from './layouts/menu.layout';
import Page from './layouts/page.layout';
import './styles.scss';

function App() {
    const [showMenu, setShowMenu] = useState(false);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    }

    return (<>
        <Menu showMenu={showMenu} setShowMenu={setShowMenu} />
        <div className='body'>
            <Header toggleMenu={toggleMenu} />
            <Page />
        </div>
    </>);
}

export default App;

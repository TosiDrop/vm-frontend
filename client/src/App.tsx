import { useState } from 'react';
import Header from './layouts/header.layout';
import Menu from './layouts/menu.layout';
import Page from './layouts/page.layout';
import './styles.scss';

export const Themes = {
    light: 'theme-light',
    dark: 'theme-dark'
}

function App() {
    const [showMenu, setShowMenu] = useState(false);
    const [theme, setTheme] = useState(Themes.dark);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    }

    const toggleTheme = () => {
        setTheme(theme => theme === Themes.dark ? Themes.light : Themes.dark);
    }

    return (
        <div className={theme}>
            <Menu showMenu={showMenu} setShowMenu={setShowMenu} />
            <div className='body'>
                <Header toggleMenu={toggleMenu} toggleTheme={toggleTheme}/>
                <Page />
            </div>
        </div>
    );
}

export default App;

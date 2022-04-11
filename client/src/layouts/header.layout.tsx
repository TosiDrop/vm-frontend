import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSun } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/logo.png';
import './header.layout.scss';
import TypeButtons from '../components/type-buttons/type-buttons.component';

interface Params {
    toggleMenu: () => void,
    toggleTheme: () => void
}
function Header({ toggleMenu, toggleTheme }: Params) {

    return <div className='header'>
        <div className='header-title'>
            <div className='logo-container'>
                <img src={logo} className="logo" alt=''></img>
            </div>
            <p className='title-text'>Tosidrop</p>
            <TypeButtons />
            <div className='header-filler'></div>
            <div className='last'>
                <button className="button light-button" onClick={toggleTheme}>
                    <FontAwesomeIcon icon={faSun} />
                </button>
                <button className="button menu-button" onClick={toggleMenu}>
                    <FontAwesomeIcon icon={faBars} />
                </button>
            </div>
        </div>
    </div>
}

export default Header;
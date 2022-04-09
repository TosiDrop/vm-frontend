import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSun } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/logo.png';
import './header.layout.scss';
import "../variables.scss";

interface Params {
    toggleMenu: () => void
}
function Header({ toggleMenu }: Params) {

    return <div className='header'>
        <div className='header-title'>
            <div className='logo-container'>
                <img src={logo} className="logo" alt=''></img>
            </div>
            <p className='title-text'>Tosidrop</p>
            <div className="type-buttons">
                <button className="claim button is-selected">
                    Claim
                </button>
                <button className="airdrop button">
                    Airdrop
                </button>
            </div>
            <div className='header-filler'></div>
            <div className='last'>
                <button className="button is-background light-button">
                    <FontAwesomeIcon icon={faSun} />
                </button>
                <button className="button is-background menu-button" onClick={toggleMenu}>
                    <FontAwesomeIcon icon={faBars} />
                </button>
            </div>
        </div>
    </div>
}

export default Header;
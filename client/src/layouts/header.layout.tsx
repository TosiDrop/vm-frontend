import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion, faBars, faSun } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/logo.png';
import './header.layout.scss';
import "../variables.scss";

function Header() {

    return <div className='columns header'>
        <div className='column is-three-quarters title'>
            <div className="spacer"></div>
            <img src={logo} className="logo" alt=''></img>
            <p className='title-text'>Tosidrop</p>
            <div className="spacer"></div>
            <div className="buttons">
                <button className="claim button is-selected">
                    Claim
                </button>
                <button className="airdrop button">
                    Airdrop
                </button>
            </div>
        </div>
        <div className='column buttons last'>            
            <button className="button is-background-button">
                <FontAwesomeIcon icon={faCircleQuestion} />
            </button>
            <button className="button is-background-button">
                <FontAwesomeIcon icon={faBars} />
            </button>
            <button className="button is-background-button">
                <FontAwesomeIcon icon={faSun} />
            </button>
        </div>
    </div>
}

export default Header;
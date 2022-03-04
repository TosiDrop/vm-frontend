import React from 'react';
import './Menu.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet, faClockRotateLeft, faChartColumn, faMessage, faBook, faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faDiscord, faTelegram, faGithub } from '@fortawesome/free-brands-svg-icons';

export class Menu extends React.Component {
    render() {
        return <div className='menu'>
            <ul className="menu-list">
                <li><a><p className="icon"><FontAwesomeIcon icon={faWallet} /></p>Rewards</a></li>
                <li><a><p className="icon"><FontAwesomeIcon icon={faClockRotateLeft} /></p>Reward History</a></li>
                <li><a><p className="icon"><FontAwesomeIcon icon={faChartColumn} /></p>Dashboard</a></li>
                <hr />
                <li><a><p className="icon"><FontAwesomeIcon icon={faMessage} /></p>Feedback</a></li>
                <li><a><p className="icon"><FontAwesomeIcon icon={faBook} /></p>Docs <FontAwesomeIcon icon={faArrowUpRightFromSquare} /></a></li>
            </ul>
            <div className="social">
                <FontAwesomeIcon icon={faTwitter} />
                <FontAwesomeIcon icon={faDiscord} />
                <FontAwesomeIcon icon={faTelegram} />
                <FontAwesomeIcon icon={faGithub} />
            </div>
        </div>;
    }
}
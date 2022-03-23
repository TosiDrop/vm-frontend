import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet, faClockRotateLeft, faChartColumn, faMessage, faBook, faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faDiscord, faTelegram, faGithub } from '@fortawesome/free-brands-svg-icons';
import './menu.layout.scss';

export class Menu extends React.Component {
    render() {
        return <div className='menu'>
            <ul className="menu-list">
                <li><a href="/"><p className="icon"><FontAwesomeIcon icon={faWallet} /></p>Rewards</a></li>
                <li><a href="/history"><p className="icon"><FontAwesomeIcon icon={faClockRotateLeft} /></p>Reward History</a></li>
                <li><a href="/dashboard"><p className="icon"><FontAwesomeIcon icon={faChartColumn} /></p>Dashboard</a></li>
                <hr />
                <li><a href="/feedback"><p className="icon"><FontAwesomeIcon icon={faMessage} /></p>Feedback</a></li>
                <li><a target='_blank' href="http://medium.com"><p className="icon"><FontAwesomeIcon icon={faBook} /></p>Docs <FontAwesomeIcon icon={faArrowUpRightFromSquare} /></a></li>
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
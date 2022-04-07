import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet, faClockRotateLeft, faChartColumn, faMessage, faBook, faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faDiscord, faTelegram, faGithub } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';
import './menu.layout.scss';

export class Menu extends React.Component {
    render() {
        return <>
            <div className='menu-fill-hor'></div>
            <div className='menu'>
                <div className='menu-fill-ver'></div>
                <div className='menu-content'>
                    <ul className="menu-list">
                        <li><Link to="/"><p className="icon"><FontAwesomeIcon icon={faWallet} /></p>Rewards</Link></li>
                        <li><Link to="/history"><p className="icon"><FontAwesomeIcon icon={faClockRotateLeft} /></p>Reward History</Link></li>
                        <li><Link to="/dashboard"><p className="icon"><FontAwesomeIcon icon={faChartColumn} /></p>Dashboard</Link></li>
                        <hr />
                        <li><Link to="/feedback"><p className="icon"><FontAwesomeIcon icon={faMessage} /></p>Feedback</Link></li>
                        <li><a target='_blank' rel="noreferrer" href="http://medium.com"><p className="icon"><FontAwesomeIcon icon={faBook} /></p>Docs <FontAwesomeIcon icon={faArrowUpRightFromSquare} /></a></li>
                    </ul>
                    <div className="social">
                        <FontAwesomeIcon icon={faTwitter} />
                        <FontAwesomeIcon icon={faDiscord} />
                        <FontAwesomeIcon icon={faTelegram} />
                        <FontAwesomeIcon icon={faGithub} />
                    </div>
                </div>
            </div>
        </>;
    }
}

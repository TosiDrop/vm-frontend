import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion, faBars, faSun } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/logo.png';
import './header.layout.scss';
import "../variables.scss";

export class Header extends React.Component {
    render() {
        return <div className='columns header'>
            <div className='column is-three-quarters title'>
                <img src={logo} className="logo"></img>
                <p className='title-text'>Tosidrop</p>
                <div className="buttons">
                    <button className="claim button is-selected">
                        Claim
                    </button>
                    <button className="airdrop button">
                        Airdrop
                    </button>
                </div>
            </div>
            <div className='column buttons'>
                <button className="button is-background-button">addr1daad...cc4d</button>
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
        </div>;
    }
}
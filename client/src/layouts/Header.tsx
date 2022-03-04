import React from 'react';
import './Header.scss';
import '../styles.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion, faBars, faSun } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/logo.png';

export class Header extends React.Component {
    render() {
        return <div className='columns header'>
            <div className='column is-three-quarters anetabtc'>
                <img src={logo} className="logo"></img>anetaBTC
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
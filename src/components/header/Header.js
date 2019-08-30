import React, { Component } from 'react';
import './Header.scss';
import { connect } from 'react-redux';
import history from '../../history';
import DigitalNorthSeaLogo from '../../assets/DigitalNorthSeaLogo';
export const initialTabId = { id: 0 };

class Header extends Component {

  render() {
    return (
      <div className="header-container">
        <div className="logo-container" onClick={() => {
          history.push("")
        }}>
          <DigitalNorthSeaLogo></DigitalNorthSeaLogo>
        </div>
        <div className="spacer">
        </div>
      </div>

    );
  }
}

export default connect(null, null)(Header)
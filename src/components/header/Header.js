import React, { Component } from 'react';
import './Header.scss';
import { connect } from 'react-redux';
import history from '../../history';
import DigitalNorthSeaLogo from '../../assets/DigitalNorthSeaLogo';
import Slider from 'rc-slider';
import setClock from '../../actions/mapActions'
import 'rc-slider/assets/index.css';
export const initialTabId = { id: 0 };
class Header extends Component {

  constructor(props){
    super(props);
    this.changeTime = this.changeTime.bind(this);
  }

  changeTime(value){
    this.props.changeClock(value);
  }

  render() {

    const marks = {
      1975:1975,
      1985:1985,
      1995:1995,
      2005:2005,
      2015:2015,
      2025:2025,
      2035:2035            
    };

    return (
      <div className="header-container">
        <div className="logo-container" onClick={() => {
          history.push("")
        }}>
          <DigitalNorthSeaLogo></DigitalNorthSeaLogo>
        </div>
        <Slider min={1975} max={2035} marks={marks} defaultValue={new Date().getFullYear()} onChange={this.changeTime}></Slider>
        <div className="spacer">
        </div>
      </div>

    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
      changeClock: (year) => {
          dispatch(setClock(year))
      }
  }
}

export default connect(null, mapDispatchToProps)(Header)
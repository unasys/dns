import React from 'react';
import './Header.scss';
import { Link } from 'react-router-dom';
import { ReactComponent as DigitalNorthSeaLogo } from '../../assets/DigitalNorthSeaLogo.svg'
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useStateValue } from '../../utils/state';

const marks = {
  1975: 1975,
  1985: 1985,
  1995: 1995,
  2005: 2005,
  2015: 2015,
  2025: 2025,
  2035: 2035
};

const Header = () => {
  const [, dispatch] = useStateValue();
  return (
    <div className="header-container">
      <Link className="logo-container" to={""} >
        <DigitalNorthSeaLogo />
      </Link>
      <Slider min={1975} max={2035} marks={marks} defaultValue={new Date().getFullYear()} onChange={e => dispatch({ type: "changeYear", year: e })}></Slider>
      <div className="spacer">
      </div>
    </div>

  );
}

export default Header;
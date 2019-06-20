import React, { Component } from 'react';
import DigitalNorthSeaCenteredLogo from '../assets/DigitalNorthSeaCenteredLogo';
import auth0Client from './auth';
import './callback.scss';

class Callback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mounted: true
    }
  }

  async componentDidMount() {
    await auth0Client.handleAuthentication();
    this.props.history.replace('/');
  }


  render() {
    return (
      <div>
        <DigitalNorthSeaCenteredLogo></DigitalNorthSeaCenteredLogo>
      </div>
    );
  }
}

export default Callback;
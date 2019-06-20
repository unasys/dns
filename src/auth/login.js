import React, { Component } from 'react';
import auth0Client from './auth';

class Login extends Component {
  render() {
    return (
      <div>
        {!auth0Client.isAuthenticated() && auth0Client.signIn()}
      </div>
    );
  }
}

export default Login;
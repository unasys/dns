import auth0 from 'auth0-js';
const axios = require('axios');

class Auth {
  constructor() {
    this.auth0 = new auth0.WebAuth({
      domain: 'login.unasys.com',
      clientID: 'P2CR6bKH0VyM3cplO37NMKlc2h0lAwmz',
      redirectUri: process.env.NODE_ENV === 'development' ? window.location.protocol + "//" + window.location.host + "/callback" : "https://" + window.location.host + '/callback',
      audience: 'https://api.unasys.com',
      responseType: 'token id_token',
      scope: 'openid profile'
    });
    axios.defaults.baseURL = 'https://api.unasys.com/'
    //axios.defaults.baseURL = 'http://localhost:63266/'
    this.getProfile = this.getProfile.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
  }

  getProfile() {
    return this.profile;
  }

  getIdToken() {
    return this.idToken;
  }

  getAccessToken() {
    return this.accessToken;
  }

  isAuthenticated() {
    return new Date().getTime() < this.expiresAt;
  }

  signIn() {
    this.auth0.authorize();
  }

  handleAuthentication() {
    return new Promise((resolve, reject) => {
      this.auth0.parseHash((err, authResult) => {
        if (err) return reject(err);
        if (!authResult || !authResult.idToken) {
          return reject(err);
        }
        this.idToken = authResult.idToken;
        this.profile = authResult.idTokenPayload;
        this.accessToken = authResult.accessToken;
        // set the time that the id token will expire at
        this.expiresAt = authResult.idTokenPayload.exp * 1000;
        // axios defaults refresh case. 
        let bearerStr = 'Bearer ' + authResult.accessToken;
        axios.defaults.headers.common['Authorization'] = bearerStr;
        axios.defaults.headers.common['Content-Type'] = "application/json";
        axios.defaults.validateStatus = function (status) {
          return status < 500;
        }
        this.setSession(authResult);

        resolve();
      });
    })
  }

  setSession(authResult) {
    this.idToken = authResult.idToken;
    this.accessToken = authResult.accessToken;
    this.profile = authResult.idTokenPayload;
    // set the time that the id token will expire at
    this.expiresAt = authResult.idTokenPayload.exp * 1000;

    let bearerStr = 'Bearer ' + authResult.accessToken;
    axios.defaults.headers.common['Authorization'] = bearerStr;
    axios.defaults.headers.common['Content-Type'] = "application/json";
    axios.defaults.validateStatus = function (status) {
      return status < 500;
    }
  }

  signOut() {
    // clear id token, profile, and expiration
    this.idToken = null;
    this.profile = null;
    this.expiresAt = null;
    this.auth0.logout({
      returnTo: window.location.protocol + "//" + window.location.host,
      clientID: 'P2CR6bKH0VyM3cplO37NMKlc2h0lAwmz',
    });
  }

  silentAuth() {
    return new Promise((resolve, reject) => {
      this.auth0.checkSession({}, (err, authResult) => {
        if (err) return reject(err);
        this.setSession(authResult);
        resolve();
      });
    });
  }
}


const auth0Client = new Auth();

export default auth0Client;
import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import history from './history';
import auth0Client from './auth/auth';
import Login from './auth/login';
import Map from './components/visuals/map/Map';
import Header from './components/header/Header';
import Callback from './auth/callback';
import './App.scss';
import OilandGas from './components/pages/oil&gas/OilandGas';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import AssetIntegrity from './components/pages/assetintegrity/AssetIntegrity';
import DefinitionAndStatus from './components/pages/definitionandstatus/DefinitionAndStatus';
import createReducers from './reducers/reducers';
import { routerMiddleware } from 'connected-react-router';
import { ConnectedRouter } from 'connected-react-router';
import Walkthrough from './components/visuals/walkthrough/Walkthrough';
import SketchfabWalkthrough from './components/visuals/sketchfab-walkthrough/SketchfabWalkthrough';
import Bathymetry from './components/pages/bathymetry/Bathymetry';
import Admin from './components/pages/admin/Admin';
import WeightAndMaterial from './components/pages/weightsandmaterials/WeightAndMaterial';
import DataRoomNew from './components/pages/data-room/new/DataRoomNew';
import TaqaPoster from './assets/taqaposter.jpg';

const store = createStore(
  createReducers(history),
  {}, // initial state
  compose(
    applyMiddleware(
      routerMiddleware(history)
    )
  )
);

let mainContent = [
  <Map></Map>,
  <SketchfabWalkthrough sketchFabInitialMaximised={true}></SketchfabWalkthrough>,
  <Walkthrough></Walkthrough>, 
  <div style={{display:'flex', width:'100%', justifyContent:'center', backgroundColor:'#262B38'}}><img style={{ height:'100%', top: 0, position: 'relative', zIndex:'1'}} src={TaqaPoster}></img></div>
]

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mainContentIndex: 0,
      installations: [],
      checkingSession: true
    }
    this.changeMainContentIndex = this.changeMainContentIndex.bind(this);
  }

  async componentDidMount() {
    if (window.location.pathname === '/callback') {
      this.setState({ checkingSession: false });
      return;
    }
    try {
      await auth0Client.silentAuth();
      this.forceUpdate();
    } catch (err) {
      if (err.error !== 'login_required') console.log(err.error);
    }
    this.setState({ checkingSession: false });
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getMainPanelContent() {
    return mainContent[this.state.mainContentIndex];
  }

  changeMainContentIndex(index) {
    this.setState({
      mainContentIndex: index
    });
  }

  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <div className="app-container">
            <Route render={(props) => {
              if (this.state.checkingSession) return <span></span>;

              return <Header changeMainContent={this.changeMainContentIndex} {...props} />
            }
            } />
            <div className="content-container">
              {this.getMainPanelContent()}
              <Route path="/login" exact={true} render={(props) => auth0Client.isAuthenticated() ? (<Redirect to="/" />) : (<Login {...props} />)} />
              <Switch>
                <Route path="/projects/:currentProjectId/assetintegrity" exact={true} render={(props) => {
                  return (
                    auth0Client.isAuthenticated() ? <AssetIntegrity {...props}></AssetIntegrity> : <Redirect to="/login" />
                  )
                }} />

                <Route path="/projects/:currentProjectId/definitionandstatus" exact={true} render={(props) => {
                  if (this.state.checkingSession) return <span></span>;

                  return (
                    auth0Client.isAuthenticated() ? <DefinitionAndStatus {...props}></DefinitionAndStatus> : <Redirect to="/login" />
                  )
                }} />

                <Route path="/projects/:currentProjectId/bathymetry" exact={true} render={(props) => {
                  if (this.state.checkingSession) return <span></span>;

                  return (
                    auth0Client.isAuthenticated() ? <Bathymetry {...props}></Bathymetry> : <Redirect to="/login" />
                  )
                }} />

                <Route path="/projects/:currentProjectId/weightsandmaterials" exact={true} render={(props) => {
                  if (this.state.checkingSession) return <span></span>;

                  return (
                    auth0Client.isAuthenticated() ? <WeightAndMaterial {...props}></WeightAndMaterial> : <Redirect to="/login" />
                  )
                }} />

                <Route path="/projects/:currentProjectId/admin" exact={true} render={(props) => {
                  if (this.state.checkingSession) return <span></span>;

                  return (
                    auth0Client.isAuthenticated() ? <Admin {...props}></Admin> : <Redirect to="/login" />
                  )
                }} />

                <Route path="/projects/:currentProjectId/admin/:page" exact={true} render={(props) => {
                  if (this.state.checkingSession) return <span></span>;

                  return (
                    auth0Client.isAuthenticated() ? <Admin {...props}></Admin> : <Redirect to="/login" />
                  )
                }} />

                <Route path="/projects/:currentProjectId/data-room" exact={true} render={(props) => {
                  if (this.state.checkingSession) return <span></span>;

                  return (
                    auth0Client.isAuthenticated() ? <DataRoomNew {...props}></DataRoomNew> : <Redirect to="/login" />
                  )
                }} />

                <Route path="/bathymetry" exact={true} render={(props) => {
                  if (this.state.checkingSession) return <span></span>;

                  return (
                    auth0Client.isAuthenticated() ? <Bathymetry {...props}></Bathymetry> : <Redirect to="/login" />
                  )
                }} />

                <Route path="/callback" render={(props) => {
                  return <Callback {...props} />
                }} />

                <Route path="/" render={(props) => {
                  if (this.state.checkingSession) return <span></span>;

                  return (
                    auth0Client.isAuthenticated() ? <OilandGas {...props} installations={this.state.installations} changeMainContent={this.changeMainContentIndex}></OilandGas> : <Redirect to="/login" />
                  )
                }} />
              </Switch>
            </div>
          </div>
        </ConnectedRouter>
      </Provider>
    );
  }
}


export default App;
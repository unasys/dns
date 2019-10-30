import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import history from './history';
import Map from './components/visuals/map/Map';
import Header from './components/header/Header';
import './App.scss';
import OilandGas from './components/pages/oil&gas/OilandGas';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import createReducers from './reducers/reducers';
import { routerMiddleware } from 'connected-react-router';
import { ConnectedRouter } from 'connected-react-router';
import InstallationTable from './components/pages/tables/installationTable/InstallationTable';
import DecomYardTable from './components/pages/tables/decomYardTable/DecomYardTable';
import PipelineTable from './components/pages/tables/pipelineTable/PipelineTable';
import WindfarmTable from './components/pages/tables/windfarmTable/WindfarmTable';
import FieldTable from './components/pages/tables/fieldsTable/FieldTable';
import DynamicWidthPage from './components/pages/oil&gas/DynamicWidthPage';

const store = createStore(
  createReducers(history),
  {}, // initial state
  compose(
    applyMiddleware(
      routerMiddleware(history)
    )
  )
);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPipeline: null,
      selectedInstallation: null
    }
    this.setSelectedPipeline = this.setSelectedPipeline.bind(this);
    this.setSelectedInstallation = this.setSelectedInstallation.bind(this);
  }  

  setSelectedInstallation(newInstallation) {
    this.setState({
      selectedInstallation: newInstallation
    })
  }

  setSelectedPipeline(newPipeline) {
    this.setState({
      selectedPipeline: newPipeline
    })
  }

  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <div className="app-container">
            <Route render={(props) => {
              if (this.state.checkingSession) return <span></span>;

              return <Header {...props} />
            }
            } />
            <div className="content-container">
              <Map selectedPipeline={this.state.selectedPipeline} selectedInstallation={this.state.selectedInstallation}>
              <Switch>          
                <Route path="/installations" render={(props) => {
                  return (
                    <DynamicWidthPage backgroundColor={'rgba(39, 43, 56, 0.34)'}>
                      <InstallationTable {...props} setSelectedInstallation={this.setSelectedInstallation}></InstallationTable>
                    </DynamicWidthPage>
                  )
                }} />
                  <Route path="/decomyards" render={(props) => {
                  return (
                    <DynamicWidthPage backgroundColor={'rgba(39, 43, 56, 0.34)'}>
                      <DecomYardTable {...props}></DecomYardTable>
                    </DynamicWidthPage>
                  )
                }} />
                <Route path="/pipelines" render={(props) => {
                  return (
                    <DynamicWidthPage backgroundColor={'rgba(39, 43, 56, 0.34)'}>
                      <PipelineTable {...props} setSelectedPipeline={this.setSelectedPipeline}></PipelineTable>
                      </DynamicWidthPage>
                      )
                    }} />
                <Route path="/windfarms" render={(props) => {
                  return (
                    <DynamicWidthPage backgroundColor={'rgba(39, 43, 56, 0.34)'}>
                      <WindfarmTable {...props}></WindfarmTable>
                    </DynamicWidthPage>
                  )
                }} />
                <Route path="/fields" render={(props) => {
                  return (
                    <DynamicWidthPage backgroundColor={'rgba(39, 43, 56, 0.34)'}>
                      <FieldTable {...props}></FieldTable>
                    </DynamicWidthPage>
                  )
                }} />
              </Switch>
              <Switch>
                <Route path="/(installations|decomyards|windfarms|pipelines|fields)" render={(props) => {
                  return (
                    <OilandGas {...props} changeMainContent={this.changeMainContentIndex} hideSidePanel={true}></OilandGas>
                  )
                }} />
                <Route path="/" render={(props) => {
                  return (
                    <OilandGas {...props} changeMainContent={this.changeMainContentIndex}></OilandGas>
                  )
                }} />
              </Switch>
              </Map>
            </div>
          </div>
        </ConnectedRouter>
      </Provider>
    );
  }
}



export default App;
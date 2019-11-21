import React, { useEffect } from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import CesiumMap from './components/visuals/map/Map';
import Header from './components/header/Header';
import './App.scss';
// import OilandGas from './components/pages/oil&gas/OilandGas';

// import InstallationTable from './components/pages/tables/installationTable/InstallationTable';
// import DecomYardTable from './components/pages/tables/decomYardTable/DecomYardTable';
// import PipelineTable from './components/pages/tables/pipelineTable/PipelineTable';
// import WindfarmTable from './components/pages/tables/windfarmTable/WindfarmTable';
// import FieldTable from './components/pages/tables/fieldsTable/FieldTable';
// import DynamicWidthPage from './components/pages/oil&gas/DynamicWidthPage';

import { useStateValue } from './utils/state';
import { fetchInstallations, fetchDecomyards, fetchFields, fetchPipelines, fetchWindfarms } from './api/Installations';
import { fetchFact } from './api/RandomFact';

const unique = (arr, prop) => {
  const map = new Map();
  for (const item of arr) {
    if (!map.has(item[prop])) {
      map.set(item[prop], item)
    }
  }
  return map;
}

const App = () => {
  const [, dispatch] = useStateValue();

  useEffect(() => {
    fetchInstallations().then(installations => { dispatch({ type: "setInstallations", installations: unique(installations, "Name") }) });
    fetchDecomyards().then(decomYards => { dispatch({ type: "setDecomYards", decomYards: unique(decomYards, "Name") }) });
    fetchFields().then(fields => { dispatch({ type: "setFields", fields: unique(fields, "Field Name") }) });
    fetchPipelines().then(pipelines => { dispatch({ type: "setPipelines", pipelines: unique(pipelines, "Pipeline Id") }) });
    fetchWindfarms().then(windfarms => { dispatch({ type: "setWindfarms", windfarms: unique(windfarms, "Name") }) });
    fetchFact().then(facts => { dispatch({ type: "setFacts", facts: facts }) });
  }, []);

  return (

    <Router >
      <div className="app-container">
        <Header />
        <div className="content-container">
          <CesiumMap />

          {/* <Switch>
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
          </Switch> */}

        </div>
      </div>
    </Router>
  );
}


export default App;

import React, { useEffect } from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import CesiumMap from './components/visuals/map/Map';
import Header from './components/header/Header';
import './App.scss';
import { useStateValue } from './utils/state';
import { fetchInstallations, fetchDecomyards, fetchFields, fetchPipelines, fetchWindfarms, fetchAreas, fetchSubsurface } from './api/Installations';
import { fetchFact } from './api/RandomFact';
import InfoPanel from './components/infoPanels/InfoPanel';
import MenuPanel from './components/menuPanels/details-panel/MenuPanel';
import InstallationTable from './components/tables/InstallationTable';
import DecomYardTable from './components/tables/DecomYardTable';
import FieldTable from './components/tables/FieldTable';
import WindfarmTable from './components/tables/WindfarmTable';
import PipelineTable from './components/tables/PipelineTable';
import SurfaceTable from './components/tables/SurfaceTable';

const unique = (arr, prop) => {
  const map = new Map();
  for (const item of arr) {
    let key = item[prop];
    if (key) {
      key = key.toString();
    }
    if (!map.has(key)) {
      map.set(key, item)
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
    fetchWindfarms().then(windfarms => { dispatch({ type: "setWindfarms", windfarms: unique(windfarms, "NAME") }) });
    fetchAreas().then(areas => { dispatch({ type: "setAreas", areas: unique(areas, "name") }) });
    fetchSubsurface().then(surfaces => { dispatch({ type: "setSurfaces", surfaces: unique(surfaces, "id") }) });
    fetchFact().then(facts => { dispatch({ type: "setFacts", facts: facts }) });
  }, [dispatch]);

  return (

    <Router >
      <div className="app-container">
        <Header />
        <div className="content-container">
          <CesiumMap />
          <div id="dns-panels">
            <Switch>
              <Route path="/" exact >
                <MenuPanel />
              </Route>
              <Route path="/installations" exact >
                <InstallationTable />
              </Route>
              <Route path="/decomyards" exact >
                <DecomYardTable />
              </Route>
              <Route path="/fields" exact >
                <FieldTable />
              </Route>
              <Route path="/windfarms" exact >
                <WindfarmTable />
              </Route>
              <Route path="/pipelines" exact >
                <PipelineTable />
              </Route>
              <Route path="/surfaces" exact >
                <SurfaceTable />
              </Route>
            </Switch>
            <InfoPanel />
          </div>
        </div>
      </div>
    </Router>
  );
}


export default App;

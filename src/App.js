import React, { useEffect } from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import CesiumMap from './components/map/Map';
import Header from './components/header/Header';
import './App.scss';
import { useStateValue } from './utils/state';
import { fetchInstallations, fetchDecomyards, fetchFields, fetchPipelines, fetchWindfarms, fetchAreas, fetchSubsurface, fetchWells, fetchWrecks, fetchBasins, fetchOnsoreGasPipes, fetchOnsoreGasSites, fetchOnsoreGridCables, fetchOnsorePowerlines, fetchOnsoreWind, fetchWorkingGroups, fetchCarbonPipelines, fetchCarbonCaptureFields } from './api/Installations';
import InfoPanel from './components/infoPanels/InfoPanel';
import MenuPanel from './components/menuPanels/MenuPanel';
import InstallationTable from './components/tables/InstallationTable';
import DecomYardTable from './components/tables/DecomYardTable';
import FieldTable from './components/tables/FieldTable';
import WindfarmTable from './components/tables/WindfarmTable';
import PipelineTable from './components/tables/PipelineTable';
import SubsurfaceTable from './components/tables/SubsurfaceTable';
import WellTable from './components/tables/WellTable';
import WreckTable from './components/tables/WreckTable';
import AreaTable from './components/tables/AreaTable';
import BasinTable from './components/tables/BasinTable';
import BasicTable from './components/tables/BasicTable';

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
  const [{ onshoreGasPipes, onshoreGasSites, onshoreGridCables, onshorePowerlines, onshoreWindfarms, workingGroups }, dispatch] = useStateValue();

  useEffect(() => {
    fetchInstallations().then(installations => { dispatch({ type: "setInstallations", installations: unique(installations, "id") }) });
    fetchPipelines().then(pipelines => { dispatch({ type: "setPipelines", pipelines: unique(pipelines, "id") }) });
    // fetchDecomyards().then(decomYards => { dispatch({ type: "setDecomYards", decomYards: unique(decomYards, "id") }) });
     fetchFields().then(fields => { dispatch({ type: "setFields", fields: unique(fields, "id") }) });
     fetchCarbonCaptureFields().then(fields => { dispatch({ type: "setCCFields", fields: unique(fields, "id") }) });
     fetchCarbonPipelines().then(pipelines => { dispatch({ type: "setCCPipelines", pipelines: unique(pipelines, "id") }) });
     fetchWindfarms().then(windfarms => { dispatch({ type: "setWindfarms", windfarms: unique(windfarms, "id") }) });
    // fetchAreas().then(areas => { dispatch({ type: "setAreas", areas: unique(areas, "id") }) });
    // fetchBasins().then(basins => { dispatch({ type: "setBasins", basins: unique(basins, "id") }) });
    // fetchSubsurface().then(subsurfaces => { dispatch({ type: "setSubsurfaces", subsurfaces: unique(subsurfaces, "id") }) });
    // fetchWells().then(wells => { dispatch({ type: "setWells", wells: unique(wells, "id") }) });
    // fetchWrecks().then(wrecks => { dispatch({ type: "setWrecks", wrecks: unique(wrecks, "id") }) });
    // fetchOnsoreGasPipes().then(pipes => { dispatch({ type: "setOnshoreGasPipes", onshoreGasPipes: unique(pipes, "id") }) });
    // fetchOnsoreGasSites().then(sites => { dispatch({ type: "setOnshoreGasSites", onshoreGasSites: unique(sites, "id") }) });
    // fetchOnsoreGridCables().then(cables => { dispatch({ type: "setOnshoreGridCables", onshoreGridCables: unique(cables, "id") }) });
    // fetchOnsorePowerlines().then(powerlines => { dispatch({ type: "setOnshorePowerlines", onshorePowerlines: unique(powerlines, "id") }) });
    // fetchOnsoreWind().then(windfarms => { dispatch({ type: "setOnshoreWindfarms", onshoreWindfarms: unique(windfarms, "id") }) });
    // fetchWorkingGroups().then(workingGroups => { dispatch({ type: "setWorkingGroups", workingGroups: unique(workingGroups, "id") }) });
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
              <Route path="/areas" exact >
                <AreaTable />
              </Route>
              <Route path="/basins" exact >
                <BasinTable />
              </Route>
              <Route path="/decomyards" exact >
                <DecomYardTable />
              </Route>
              <Route path="/fields" exact >
                <FieldTable />
              </Route>
              <Route path="/ccfields" exact >
                <FieldTable isCC={true} />
              </Route>
              <Route path="/windfarms" exact >
                <WindfarmTable />
              </Route>
              <Route path="/pipelines" exact >
                <PipelineTable />
              </Route>
              <Route path="/ccpipelines" exact >
                <PipelineTable isCC={true} />
              </Route>
              <Route path="/subsurfaces" exact >
                <SubsurfaceTable />
              </Route>
              <Route path="/wells" exact >
                <WellTable />
              </Route>
              <Route path="/wrecks" exact >
                <WreckTable />
              </Route>
              <Route path="/onshoregaspipes" exact><BasicTable data={onshoreGasPipes} type="OnshoreGasPipe" rowVisible="onshoreGasPipeVisible" /></Route>
              <Route path="/onshoregassites" exact><BasicTable data={onshoreGasSites} type="OnshoreGasSite" rowVisible="onshoreGasSiteVisible" /></Route>
              <Route path="/onshoregridcables" exact><BasicTable data={onshoreGridCables} type="OnshoreGridCable" rowVisible="onshoreGridCableVisible" /></Route>
              <Route path="/onshorepowerlines" exact><BasicTable data={onshorePowerlines} type="OnshorePowerline" rowVisible="onshorePowerlineVisible" /></Route>
              <Route path="/onshorewindfarms" exact><BasicTable data={onshoreWindfarms} type="OnshoreWindfarm" rowVisible="onshoreWindfarmVisible" /></Route>
              <Route path="/workinggroups" exact><BasicTable data={workingGroups} type="WorkingGroup" rowVisible="workingGroupsVisible" /></Route>
            </Switch>
            <InfoPanel />
          </div>
        </div>
      </div>
    </Router>
  );
}


export default App;

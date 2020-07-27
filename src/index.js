import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { StateProvider } from './utils/state';

const initialState = {
    installations: new Map(),
    decomYards: new Map(),
    fields: new Map(),
    ccfields: new Map(),
    pipelines: new Map(),
    ccpipelines: new Map(),
    windfarms: new Map(),
    areas: new Map(),
    workingGroups: new Map(),
    basins: new Map(),
    subsurfaces: new Map(),
    wells: new Map(),
    wrecks: new Map(),
    onshoreGasPipes: new Map(),
    onshoreGasSites: new Map(),
    onshoreGridCables: new Map(),
    onshorePowerlines: new Map(),
    onshoreWindfarms: new Map(),
    facts: [],
    showInstallations: true,
    showPipelines: false,
    showCCPipelines: false,
    showWindfarms: true,
    showDecomYards: false,
    showFields: false,
    showCCFields: false,
    showBlocks: false,
    showSubsurfaces: false,
    showWells: false,
    showWrecks: false,
    showAreas: false,
    showWorkingGroups: false,
    showBasins: false,
    showOnshoreGasPipes: false,
    showOnshoreGasSites: false,
    showOnshoreGridCables: false,
    showOnshorePowerlines: false,
    showOnshoreWindfarms: false,
    mapStyle: "simple",
    enableTerrain: false,
    globe3D: true,
    radiusEnabled: true,
    year: 2019,
    radius: 10000,
    withInDistance: {

    }
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'changeRadius':
            return {
                ...state,
                radius: action.radius * 1000
            }
        case 'toggleRadius':
            return {
                ...state,
                radiusEnabled: !state.radiusEnabled
            }
        case 'setInstallations':
            return {
                ...state,
                installations: action.installations
            };
        case 'setDecomYards':
            return {
                ...state,
                decomYards: action.decomYards
            };
        case 'setFields':
            return {
                ...state,
                fields: action.fields
            };
        case 'setCCFields':
            return {
                ...state,
                ccfields: action.fields
            };
        case 'setSubsurfaces': {
            return {
                ...state,
                subsurfaces: action.subsurfaces
            };
        }
        case 'setPipelines':
            return {
                ...state,
                pipelines: action.pipelines
            };
        case 'setCCPipelines':
            return {
                ...state,
                ccpipelines: action.pipelines
            };
        case 'setWindfarms':
            return {
                ...state,
                windfarms: action.windfarms
            };
        case 'setAreas':
            return {
                ...state,
                areas: action.areas
            };
        case 'setBasins':
            return {
                ...state,
                basins: action.basins
            };
        case 'setFacts':
            return {
                ...state,
                facts: action.facts
            };
        case 'setWells':
            return {
                ...state,
                wells: action.wells
            };
        case 'setWrecks':
            return {
                ...state,
                wrecks: action.wrecks
            };

        case 'setOnshoreGasPipes': return { ...state, onshoreGasPipes: action.onshoreGasPipes };
        case 'setOnshoreGasSites': return { ...state, onshoreGasSites: action.onshoreGasSites };
        case 'setOnshoreGridCables': return { ...state, onshoreGridCables: action.onshoreGridCables };
        case 'setOnshorePowerlines': return { ...state, onshorePowerlines: action.onshorePowerlines };
        case 'setOnshoreWindfarms': return { ...state, onshoreWindfarms: action.onshoreWindfarms };
        case 'setWorkingGroups': return { ...state, workingGroups: action.workingGroups };

        case 'changeYear':
            return {
                ...state,
                year: action.year
            };
        case 'toggle3D':
            return {
                ...state,
                globe3D: !state.globe3D
            };
        case 'toggleTerrain':
            return {
                ...state,
                enableTerrain: !state.enableTerrain
            };
        case 'togglePipelines':
            return {
                ...state,
                showPipelines: !state.showPipelines
            };
        case 'toggleCCPipelines':
            return {
                ...state,
                showCCPipelines: !state.showCCPipelines
            };
        case 'toggleInstallations':
            return {
                ...state,
                showInstallations: !state.showInstallations
            };
        case 'toggleWindfarms':
            return {
                ...state,
                showWindfarms: !state.showWindfarms
            };
        case 'toggleDecomYards':
            return {
                ...state,
                showDecomYards: !state.showDecomYards
            };
        case 'toggleFields':
            return {
                ...state,
                showFields: !state.showFields
            };
        case 'toggleCCFields':
            return {
                ...state,
                showCCFields: !state.showCCFields
            };
        case 'toggleAreas':
            return {
                ...state,
                showAreas: !state.showAreas
            };
        case 'toggleBasins':
            return {
                ...state,
                showBasins: !state.showBasins
            };
        case 'toggleSubsurfaces':
            return {
                ...state,
                showSubsurfaces: !state.showSubsurfaces
            };
        case 'toggleBlocks':
            return {
                ...state,
                showBlocks: !state.showBlocks
            };
        case 'toggleWells':
            return {
                ...state,
                showWells: !state.showWells
            };
        case 'toggleWrecks':
            return {
                ...state,
                showWrecks: !state.showWrecks
            };

        case 'toggleOnshoreGasPipes': return { ...state, showOnshoreGasPipes: !state.showOnshoreGasPipes };
        case 'toggleOnshoreGasSites': return { ...state, showOnshoreGasSites: !state.showOnshoreGasSites };
        case 'toggleOnshoreGridCables': return { ...state, showOnshoreGridCables: !state.showOnshoreGridCables };
        case 'toggleOnshorePowerlines': return { ...state, showOnshorePowerlines: !state.showOnshorePowerlines };
        case 'toggleOnshoreWindfarms': return { ...state, showOnshoreWindfarms: !state.showOnshoreWindfarms };
        case 'toggleWorkingGroups': return { ...state, showWorkingGroups: !state.showWorkingGroups };
        case "installationsVisible":
            return {
                ...state,
                installationsVisible: action.installationsVisible
            };
        case "decomYardsVisible":
            return {
                ...state,
                decomnYardsVisible: action.decomnYardsVisible
            };
        case "fieldsVisible":
            return {
                ...state,
                fieldsVisible: action.fieldsVisible
            };
        case "ccfieldsVisible":
            return {
                ...state,
                ccfieldsVisible: action.ccfieldsVisible
            };
        case "areasVisible":
            return {
                ...state,
                areasVisible: action.areasVisible
            };
        case "basinsVisible":
            return {
                ...state,
                basinsVisible: action.basinsVisible
            };
        case "windfarmsVisible":
            return {
                ...state,
                windfarmsVisible: action.windfarmsVisible
            };
        case "subsurfacesVisible":
            return {
                ...state,
                subsurfacesVisible: action.subsurfacesVisible
            };
        case "pipelinesVisible":
            return {
                ...state,
                pipelinesVisible: action.pipelinesVisible
            };
        case "ccpipelinesVisible":
            return {
                ...state,
                ccpipelinesVisible: action.ccpipelinesVisible
            };
        case "wellsVisible":
            return {
                ...state,
                wellsVisible: action.wellsVisible
            };
        case "wrecksVisible":
            return {
                ...state,
                wrecksVisible: action.wrecksVisible
            };
        case 'onshoreGasPipesVisible': return { ...state, onshoreGasPipesVisible: action.onshoreGasPipesVisible };
        case 'onshoreGasSitesVisible': return { ...state, onshoreGasSitesVisible: action.onshoreGasSitesVisible };
        case 'onshoreGridCablesVisible': return { ...state, onshoreGridCablesVisible: action.onshoreGridCablesVisible };
        case 'onshorePowerlinesVisible': return { ...state, onshorePowerlinesVisible: action.onshorePowerlinesVisible };
        case 'onshoreWindfarmsVisible': return { ...state, onshoreWindfarmsVisible: action.onshoreWindfarmsVisible };
        case 'workingGroupsVisible': return { ...state, workingGroupsVisible: action.workingGroupsVisible };
        case "changeMapStyle":
            return {
                ...state,
                mapStyle: action.mapStyle
            };
        case "setWithIn":
            return {
                ...state,
                withInDistance: action.withIn
            };
        case "clearWithIn":
            return {
                ...state,
                withInDistance: {}
            };
        default:
            return state;
    }
};

ReactDOM.render(
    <StateProvider initialState={initialState} reducer={reducer}>
        <App />
    </StateProvider>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

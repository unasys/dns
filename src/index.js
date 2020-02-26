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
    pipelines: new Map(),
    windfarms: new Map(),
    areas: new Map(),
    basins: new Map(),
    subsurfaces: new Map(),
    wells: new Map(),
    wrecks: new Map(),
    facts: [],
    showInstallations: true,
    showPipelines: false,
    showWindfarms: true,
    showDecomYards: false,
    showFields: false,
    showBlocks: false,
    showSubsurfaces: false,
    showWells: false,
    showWrecks: false,
    showAreas: false,
    showBasins: false,
    mapStyle: "simple",
    enableTerrain: false,
    globe3D: true,
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
                radius: action.radius*1000
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
        case "installationFiltersChange":
            return {
                ...state,
                installationFilters: action.filters
            };
        case "installationsVisible":
            return {
                ...state,
                installationsVisible: action.installationsVisible
            };
        case "decomYardFiltersChange":
            return {
                ...state,
                decomYardFilters: action.filters
            };
        case "decomYardsVisible":
            return {
                ...state,
                decomnYardsVisible: action.decomnYardsVisible
            };
        case "fieldFiltersChange":
            return {
                ...state,
                fieldFilters: action.filters
            };
        case "fieldsVisible":
            return {
                ...state,
                fieldsVisible: action.fieldsVisible
            };
        case "areaFiltersChange":
            return {
                ...state,
                areaFilters: action.filters
            };
        case "areasVisible":
            return {
                ...state,
                areasVisible: action.areasVisible
            };
        case "basinFiltersChange":
            return {
                ...state,
                basinFilters: action.filters
            };
        case "basinsVisible":
            return {
                ...state,
                basinsVisible: action.basinsVisible
            };
        case "windfarmFiltersChange":
            return {
                ...state,
                windfarmFilters: action.filters
            };
        case "windfarmsVisible":
            return {
                ...state,
                windfarmsVisible: action.windfarmsVisible
            };
        case "subsurfaceFiltersChange":
            return {
                ...state,
                subsurfaceFilters: action.filters
            };
        case "subsurfacesVisible":
            return {
                ...state,
                subsurfacesVisible: action.subsurfacesVisible
            };
        case "pipelineFiltersChange":
            return {
                ...state,
                pipelineFilters: action.filters
            };
        case "pipelinesVisible":
            return {
                ...state,
                pipelinesVisible: action.pipelinesVisible
            };
        case "wellFiltersChange":
            return {
                ...state,
                wellFilters: action.filters
            };
        case "wellsVisible":
            return {
                ...state,
                wellsVisible: action.wellsVisible
            };
        case "wreckFiltersChange":
            return {
                ...state,
                wreckFilters: action.filters
            };
        case "wrecksVisible":
            return {
                ...state,
                wrecksVisible: action.wrecksVisible
            };
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

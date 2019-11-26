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
    facts: [],
    showInstallations: true,
    showPipelines: false,
    showWindfarms: true,
    showDecomYards: true,
    showFields: false,
    showBlocks: false,
    year: 2019
};

const reducer = (state, action) => {

    switch (action.type) {
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
        case 'setFacts':
            return {
                ...state,
                facts: action.facts
            };
        case 'changeYear':
            return {
                ...state,
                year: action.year
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
        case 'toggleBlocks':
            return {
                ...state,
                showBlocks: !state.showBlocks
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

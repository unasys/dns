import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { StateProvider } from './utils/state';

const initialState = { installations: [], decomYards: [], fields: [], pipelines: [], windfarms: [], facts: [], showInstallations: true, showPipelines: false, showWindfarms: true, showDecomYards: true, showFields: false, showBlocks: false };

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

import { combineReducers } from 'redux';
import InstallationReducer from '../reducers/installationReducer';
import BathymetryReducer from '../reducers/bathymetryReducer';
import { connectRouter } from 'connected-react-router';

export default (history) => combineReducers({
    router: connectRouter(history),
    InstallationReducer,
    BathymetryReducer
})
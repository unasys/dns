import { combineReducers } from 'redux';
import InstallationReducer from '../reducers/installationReducer';
import { connectRouter } from 'connected-react-router';

export default (history) => combineReducers({
    router: connectRouter(history),
    InstallationReducer,
})
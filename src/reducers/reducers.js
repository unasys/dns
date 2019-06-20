import { combineReducers } from 'redux';
import HeaderReducer from '../reducers/headerReducer';
import InstallationReducer from '../reducers/installationReducer';
import SketchfabReducer from '../reducers/sketchfabReducer';
import WalkthroughReducer from '../reducers/walkthroughReducer';
import BathymetryReducer from '../reducers/bathymetryReducer';
import { connectRouter } from 'connected-react-router';

export default (history) => combineReducers({
    router: connectRouter(history),
    HeaderReducer,
    InstallationReducer,
    SketchfabReducer,
    WalkthroughReducer,
    BathymetryReducer
})
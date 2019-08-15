import { CHANGE_CURRENT_INSTALLATION, SET_CESIUM_INSTALLATIONS, CHANGE_INSTALLATION_FILTER_TYPE, INSTALLATION_FILTER_TYPES, SET_CESIUM_DECOMYARDS, SET_CESIUM_PIPELINES} from '../actions/installationActions';

let initialState = {
    currentInstallation: null,
    cesiumInstallations: [],
    cesiumPipelines:[],
    cesiumDecomyards:[],
    installationFilter: INSTALLATION_FILTER_TYPES.OilAndGas
}
  
export default function(state = initialState, action) {
    switch(action.type) {
        case CHANGE_CURRENT_INSTALLATION:
            return ({
                ...state,
                currentInstallation: action.currentInstallation
            })
        case SET_CESIUM_INSTALLATIONS: 
            return ({
                ...state, 
                cesiumInstallations: action.installations
            })
        case SET_CESIUM_DECOMYARDS:
            return ({
                ...state,
                cesiumDecomyards: action.decomyards
            })
        case SET_CESIUM_PIPELINES:
            return ({
                ...state,
                cesiumPipelines: action.pipelines
            })
        case CHANGE_INSTALLATION_FILTER_TYPE: 
            return ({
                ...state,
                installationFilter: { type: action.filterType, propertyName: action.propertyName, on: action.filterOn } 
            })
        default:
            return state;
    }
}
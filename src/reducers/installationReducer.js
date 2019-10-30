import { SET_CURRENT_ENTITY, SET_CESIUM_INSTALLATIONS, CHANGE_INSTALLATION_FILTER_TYPE, INSTALLATION_FILTER_TYPES, SET_CESIUM_DECOMYARDS, SET_CESIUM_PIPELINES, SET_CESIUM_WINDFARMS, SET_CESIUM_FIELDS} from '../actions/installationActions';

let initialState = {
    currentEntity: null, 
    cesiumInstallations: [],
    cesiumPipelines:[],
    cesiumDecomyards:[],
    cesiumWindfarms: [],
    cesiumFields: [],
    installationFilter: INSTALLATION_FILTER_TYPES.OilAndGas
}
  
export default function(state = initialState, action) {
    switch(action.type) {
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
        case SET_CURRENT_ENTITY:
                return ({
                    ...state,
                    currentEntity: action.currentEntity
                })
        case SET_CESIUM_WINDFARMS:
            return ({
                ...state,
                cesiumWindfarms: action.windfarms
            })
        case CHANGE_INSTALLATION_FILTER_TYPE: 
            return ({
                ...state,
                installationFilter: { type: action.filterType, propertyName: action.propertyName, on: action.filterOn } 
            })
        case SET_CESIUM_FIELDS:
            return ({
                ...state,
                cesiumFields: action.fields
            })

        default:
            return state;
    }
}
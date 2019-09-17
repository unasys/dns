import { TOGGLE_QUADRANTS, TOGGLE_WELLS, TOGGLE_LICENSES, UPDATE_POSITIONS, TOGGLE_PIPELINES } from '../actions/bathymetryActions';

const initialState = {
    ogaFieldsSwitched: false,
    ogaQuadrantsSwitched: false,
    ogaWellsSwitched: false,
    ogaLicensesSwitched: false, 
    ogaPipelinesSwitched: true, 
    positions: []
}

export default function(state = initialState, action) {
    switch(action.type) {
        case TOGGLE_QUADRANTS:
            return ({
                ...state,
                ogaQuadrantsSwitched: !state.ogaQuadrantsSwitched
            })
        case TOGGLE_WELLS:
            return ({
                ...state,
                ogaWellsSwitched: !state.ogaWellsSwitched
            })
        case TOGGLE_LICENSES:
            return ({
                ...state,
                ogaLicensesSwitched: !state.ogaLicensesSwitched
            })
        case TOGGLE_PIPELINES:
            return ({
                ...state,
                ogaPipelinesSwitched: !state.ogaPipelinesSwitched
            })
        case UPDATE_POSITIONS: 
            return ({
                ...state, 
                positions: Object.assign([], action.positions)
            })
        default:
            return state;
    }
}
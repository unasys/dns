import { TOGGLE_QUADRANTS, TOGGLE_WELLS, TOGGLE_LICENSES, TOGGLE_INFRASTRUCTURE, UPDATE_POSITIONS } from '../actions/bathymetryActions';

const initialState = {
    ogaFieldsSwitched: false,
    ogaQuadrantsSwitched: false,
    ogaWellsSwitched: false,
    ogaLicensesSwitched: false, 
    ogaInfrastructureSwitched: false, 
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
        case TOGGLE_INFRASTRUCTURE:
            return ({
                ...state,
                ogaInfrastructureSwitched: !state.ogaInfrastructureSwitched
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
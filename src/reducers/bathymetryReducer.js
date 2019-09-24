import { TOGGLE_QUADRANTS, TOGGLE_WELLS, UPDATE_POSITIONS, TOGGLE_PIPELINES, TOGGLE_FIELDS } from '../actions/bathymetryActions';

const initialState = {
    ogaFieldsSwitched: false,
    ogaQuadrantsSwitched: false,
    ogaWellsSwitched: false,
    ogaFieldsSwitched: false, 
    ogaPipelinesSwitched: false, 
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
        case TOGGLE_FIELDS:
            return ({
                ...state,
                ogaFieldsSwitched: !state.ogaFieldsSwitched
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
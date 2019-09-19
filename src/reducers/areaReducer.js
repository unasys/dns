import { SET_CURRENT_AREA } from '../actions/areaActions';

let initialState = {
    currentArea: { name: "North Sea", 
    flyTo: {north: 55.0, east: 6.0, south: 46.0, west: -4.0, pitch: -65},
    details: {
        name: "North Sea"
    }, 
    }
}
  
export default function(state = initialState, action) {
    switch(action.type) {
        case SET_CURRENT_AREA:
            console.log(action.currentArea);
            return ({
                ...state,
                currentArea: action.currentArea
            })
        default:
            return state;
    }
}
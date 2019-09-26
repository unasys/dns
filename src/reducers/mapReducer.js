import { CHANGE_CLOCK } from '../actions/mapActions';

let initialState = {
    year: new Date().getFullYear()
    
}
  
export default function(state = initialState, action) {
    switch(action.type) {
        case CHANGE_CLOCK:
            return ({
                ...state,
                year: action.year
            })

        default:
            return state;
    }
}
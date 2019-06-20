import { CHANGE_WALKTHROUGH_SRC } from '../actions/walkthroughActions';

const initialState = {
    walkthroughSrc: null    
}

export default function(state = initialState, action) {
    switch(action.type) {
        case CHANGE_WALKTHROUGH_SRC:
            return ({
                ...state,
                walkthroughSrc: action.walkthroughSrc
            })
        default:
            return state;
    }
}
import { CHANGE_ACTIVE_TAB } from '../actions/headerActions';
import { initialTabState }  from '../components/header/Header';

const initialState = {
    activeTab: initialTabState
}

export default function(state = initialState, action) {
    switch(action.type) {
        case CHANGE_ACTIVE_TAB:
            return ({
                ...state,
                activeTab: action.activeTab
            })
        default:
            return state;
    }
}
import { CHANGE_ACTIVE_TAB } from '../actions/headerActions';
import { initialTabId }  from '../components/header/Header';

const initialState = {
    activeTab: initialTabId
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
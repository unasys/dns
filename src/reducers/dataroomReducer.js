import { UPDATE_LABEL_FILTERS, CLEAR_FILTERS } from '../actions/dataroomActions';

const initialState = {
    filters: []
}

export default function (state = initialState, action) {
    switch (action.type) {
        case UPDATE_LABEL_FILTERS:
            return ({
                ...state,
                filters: action.filters
            })
        case CLEAR_FILTERS:
            return ({
                ...state,
                filters: []
            })
        default:
            return state;
    }
}
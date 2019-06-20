import { CHANGE_SKETCHFAB_ID, CHANGE_ANNOTATION_INDEX } from '../actions/sketchfabActions';

const initialState = {
    sketchfabId: null,
    annotationModelId: null, 
    annotationIndex: null 
}

export default function(state = initialState, action) {
    switch(action.type) {
        case CHANGE_SKETCHFAB_ID:
            return ({
                ...state,
                sketchfabId: action.sketchfabId
            })
        case CHANGE_ANNOTATION_INDEX: 
            return ({
                ...state, 
                annotationIndex: action.annotationIndex,
                annotationModelId: action.modelId
            })
        default:
            return state;
    }
}
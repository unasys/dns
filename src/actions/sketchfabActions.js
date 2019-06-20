export const CHANGE_SKETCHFAB_ID = "CHANGE_SKETCHFAB_ID";
export const CHANGE_ANNOTATION_INDEX = "CHANGE_ANNOTATION_INDEX";

export function changeSketchfabId(sketchfabId) {
    return {type: CHANGE_SKETCHFAB_ID, sketchfabId};
}

export function changeAnnotationIndex(modelId, annotationIndex) {
    return {
        type: CHANGE_ANNOTATION_INDEX,
        modelId: modelId,
        annotationIndex: annotationIndex
    }
}
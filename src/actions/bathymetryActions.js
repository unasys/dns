export const TOGGLE_FIELDS = "TOGGLE_FIELDS";
export const TOGGLE_QUADRANTS = "TOGGLE_QUADRANTS";
export const TOGGLE_WELLS = "TOGGLE_WELLS";
export const TOGGLE_LICENSES = "TOGGLE_LICENSES";
export const TOGGLE_PIPELINES = "TOGGLE_PIPELINES";
export const UPDATE_POSITIONS = "UPDATE_POSITIONS";

export function toggleFields() {
    return {type: TOGGLE_FIELDS};
}

export function toggleQuadrants() {
    return {type: TOGGLE_QUADRANTS};
}

export function toggleWells() {
    return {type: TOGGLE_WELLS};
}

export function toggleLicenses() {
    return {type: TOGGLE_LICENSES};
}

export function togglePipelines() {
    return {type: TOGGLE_PIPELINES};
}

export function updatePositions(positions) {
    return {type: UPDATE_POSITIONS, positions}
}
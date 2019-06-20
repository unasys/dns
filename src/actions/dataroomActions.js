export const UPDATE_LABEL_FILTERS = "UPDATE_LABEL_FILTERS";
export const CLEAR_FILTERS = "CLEAR_FILTERS";

export function changeFilters(filters) {
    return {
        type: UPDATE_LABEL_FILTERS,
        filters
    }
}

export function clearFilters() {
    return {
        type: CLEAR_FILTERS
    }
}
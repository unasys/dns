export const CHANGE_ACTIVE_TAB = "CHANGE_ACTIVE_TAB";


export function changeActiveTab(activeTab) {
    return {type: CHANGE_ACTIVE_TAB, activeTab};
}
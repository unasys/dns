export const CHANGE_CURRENT_INSTALLATION = "CHANGE_CURRENT_INSTALLATION";
export const SET_CESIUM_INSTALLATIONS = "SET_CESIUM_INSTALLATIONS";
export const CHANGE_INSTALLATION_FILTER_TYPE = "CHANGE_INSTALLATION_FILTER_TYPE";
export const SET_CESIUM_DECOMYARDS = "SET_CESIUM_DECOMYARDS";
export const SET_CESIUM_WINDFARMS = "SET_CESIUM_WINDFARMS";
export const CHANGE_DECOMYARD_FILTER_TYPE = "CHANGE_DECOMYARD_FILTER_TYPE";
export const SET_CESIUM_PIPELINES = "SET_CESIUM_PIPELINES";
export const CHANGE_PIPELINE_FILTER_TYPE = "CHANGE_PIPELINE_FILTER_TYPE";
export const CHANGE_WINDFARM_FILTER_TYPE = "CHANGE_WINDFARM_FILTER_TYPE";

export const INSTALLATION_FILTER_TYPES = {
    OilAndGas: 1,
    WasteToEnergy: 2,
    OffshoreWind: 3,
    MyProjects: 4,
    Property: 5
}

export function changeCurrentInstallation(currentInstallation) {
    return { type: CHANGE_CURRENT_INSTALLATION, currentInstallation };
}

export function setCesiumInstallations(installations) {
    return { type: SET_CESIUM_INSTALLATIONS, installations }
}

export function changeInstallationFilterType(filterType, propertyName, filterOn) {
    return { type: CHANGE_INSTALLATION_FILTER_TYPE, filterType, propertyName, filterOn }
}

export function setCesiumDecomyards(decomyards) {
    return { type: SET_CESIUM_DECOMYARDS, decomyards }
}


export function setCesiumWindfarms(windfarms) {
    return { type: SET_CESIUM_WINDFARMS, windfarms }
}

export function changeDecomYardFilterType(filterType, propertyName, filterOn) {
    return { type: CHANGE_DECOMYARD_FILTER_TYPE, filterType, propertyName, filterOn }
}

export function setCesiumPipelines(pipelines) {
    return { type: SET_CESIUM_PIPELINES, pipelines }
}

export function changePipelineFilterType(filterType, propertyName, filterOn) {
    return { type: CHANGE_PIPELINE_FILTER_TYPE, filterType, propertyName, filterOn }
}

export function changeWindfarmFilterType(filterType, propertyName, filterOn) {
    return { type: CHANGE_WINDFARM_FILTER_TYPE, filterType, propertyName, filterOn }
}
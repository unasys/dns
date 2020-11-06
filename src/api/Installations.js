const assetsBaseUrl = process.env.NODE_ENV === 'development' ? 'https://digitalnorthsea.blob.core.windows.net' : 'https://assets.digitalnorthsea.com';
function sortByName(a, b) {
    var nameA = a.name?.toUpperCase(); // ignore upper and lowercase
    var nameB = b.name?.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
        return -1;
    }
    if (nameA > nameB) {
        return 1;
    }

    // names must be equal
    return 0;
}
export async function fetchInstallations() {
    let url = assetsBaseUrl + `/data/installations.json`;
    const response = await fetch(url);
    const data = await response.json();
    data.forEach(entity => {
        if (!entity.id) {
            entity.id = entity["installation_id"];
        }

        if (!entity.areaId) {
            entity.areaId = entity.areaid;
        }

        if (!entity.basinId) {
            entity.basinId = entity.basinid;
        }

        if(!entity.workingGroupId){
            entity.workingGroupId = entity.workingroupid;
        }

        if (!entity.name) {
            entity.name = entity.Name;
        }
    });
    data.sort(sortByName);
    return data;
}

export async function fetchDecomyards() {
    let url = assetsBaseUrl + `/data/decomyards/decomyards.json`;
    const response = await fetch(url);
    const data = await response.json();
    data.forEach(entity => {
        if (!entity.id) {
            entity.id = entity.Name;
        }

        if (!entity.areaId) {
            entity.areaId = entity.areaid;
        }

        if (!entity.basinId) {
            entity.basinId = entity.basinid;
        }

        if(!entity.workingroupId){
            entity.workingroupId = entity.workingroupid;
        }

        if (!entity.name) {
            entity.name = entity.Name;
        }
    });
    return data.sort(sortByName);
}

export async function fetchPipelines() {
    let url = assetsBaseUrl + `/data/pipelines/pipelines.json`;
    const response = await fetch(url);
    const data = await response.json();
    data.forEach(entity => {
        if (!entity.id) {
            entity.id = entity.pipeline_id;
        }

        if (!entity.areaIds) {
            entity.areaIds = entity.Areaid ?? [];
        }

        if (!entity.basinIds) {
            entity.basinIds = entity.Basinid ?? [];
        }

        if(!entity.workingGroupId){
            entity.workingGroupId = entity.WorkingGroupId;
        }

        if(!entity.installationId){
            entity.installationId = entity["installation_id"];
        }

        if (!entity.name) {
            entity.name = entity["pipeline_name"];
        }
    });
    return data.sort(sortByName);
}

export async function fetchCarbonPipelines() {
    let url = assetsBaseUrl + `/data/CarbonCapture/pipeline_ccus.json`;
    const response = await fetch(url);
    const data = await response.json();
 
    data.forEach(entity => {
        if (!entity.id) {
            entity.id = entity.pipeline_id;
        }

        if (!entity.areaIds) {
            entity.areaIds = entity.Areaid ?? [];
        }

        if (!entity.basinIds) {
            entity.basinIds = entity.Basinid ?? [];
        }

        if(!entity.workingGroupId){
            entity.workingGroupId = entity.WorkingGroupId;
        }

        if (!entity.name) {
            entity.name = entity["pipeline_name"];
        }

    });
    return data.sort(sortByName);
}

export async function fetchWindfarms() {
    let url = assetsBaseUrl + `/data/windfarms/windfarms.json`;
    const response = await fetch(url);
    const data = await response.json();
    data.forEach(entity => {
        if (!entity.id) {
            entity.id = entity.Name;
        }

        if (!entity.areaId) {
            entity.areaId = entity.areaid;
        }

        if (!entity.basinId) {
            entity.basinId = entity.basinid;
        }

        if(!entity.workingroupId){
            entity.workingroupId = entity.workingroupid;
        }

        if (!entity.name) {
            entity.name = entity.Name;
        }
    });
    return data.sort(sortByName);
}

export async function fetchFields() {
    let url = assetsBaseUrl + `/data/fields/fields.json`;
    const response = await fetch(url);
    const data = await response.json();
 
    data.forEach(entity => {
        if (!entity.id) {
            entity.id = entity.GID;
        }

        if (!entity.areaId) {
            entity.areaId = entity.areaid;
        }

        if (!entity.basinId) {
            entity.basinId = entity.basinid;
        }

        if(!entity.workingGroupId){
            entity.workingGroupId = entity.workinggroupid;
        }

        if (!entity.name) {
            entity.name = entity["Field Name"];
        }

    });
    return data.sort(sortByName);
}

export async function fetchCarbonCaptureFields() {
    let url = assetsBaseUrl + `/data/CarbonCapture/fields_ccus.json`;
    const response = await fetch(url);
    const data = await response.json();
 
    data.forEach(entity => {
        if (!entity.id) {
            entity.id = entity.GID;
        }

        if (!entity.areaId) {
            entity.areaId = entity.areaid;
        }

        if (!entity.basinId) {
            entity.basinId = entity.basinid;
        }

        if(!entity.workingGroupId){
            entity.workingGroupId = entity.workinggroupid;
        }

        if (!entity.name) {
            entity.name = entity["Field Name"];
        }

    });
    return data.sort(sortByName);
}

export async function fetchSubsurface() {
    let url = assetsBaseUrl + `/data/subsurface/Subsurface.json`;
    const response = await fetch(url);
    const data = await response.json();
    data.forEach(entity => {
        if (!entity.id) {
            entity.id = entity.GID;
        }

        if (!entity.areaId) {
            entity.areaId = entity.areaid;
        }

        if(!entity.workingroupId){
            entity.workingroupId = entity.workingroupid;
        }

        if (!entity.basinId) {
            entity.basinId = entity.basinid;
        }
    });
    return data;
}

export async function fetchWells() {
    let url = assetsBaseUrl + `/data/wells/wells.json`;
    const response = await fetch(url);
    const data = await response.json();
    data.forEach(entity => {
        if (!entity.id) {
            entity.id = entity.GID;
        }

        if (!entity.areaId) {
            entity.areaId = entity.Areaid;
        }

        if (!entity.basinId) {
            entity.basinId = entity.Basinid;
        }

        if(!entity.workingGroupId){
            entity.workingGroupId = entity.workinggroupid;
        }

        if (entity.Geometry.coordinates) {
            entity.Geometry.coordinates = entity.Geometry.coordinates.slice(0, 2);
        }

        if (!entity.name) {
            entity.name = entity["Well Name"];
        }
    });
    return data.sort(sortByName);
}

export async function fetchWrecks() {
    let url = assetsBaseUrl + `/data/wrecks/wrecks.json`;
    const response = await fetch(url);
    const data = await response.json();
    data.forEach(entity => {
        if (!entity.id) {
            entity.id = entity.GID;
        }

        if (!entity.areaId) {
            entity.areaId = entity.areaid;
        }

        if (!entity.basinId) {
            entity.basinId = entity.basinid;
        }

        if(!entity.workingroupId){
            entity.workingroupId = entity.workingroupid;
        }

        if (!entity.name) {
            entity.name = entity.Name;
        }
    });
    return data.sort(sortByName);
}

export async function fetchAreas() {
    let url = assetsBaseUrl + `/data/areas.json`;
    const response = await fetch(url);
    const data = await response.json();
    data.forEach(entity => {
        if (!entity.id) {
            entity.id = entity.GID;
        }

        if (!entity.basinId) {
            entity.basinId = entity.basinid;
        }

        if(!entity.workingroupId){
            entity.workingroupId = entity.workingroupid;
        }

        if (!entity.name) {
            entity.name = entity["Area Name"];
        }
    });
    return data.sort(sortByName);
}

export async function fetchBasins() {
    let url = assetsBaseUrl + `/data/basins.json`;
    const response = await fetch(url);
    const data = await response.json();
    data.forEach(entity => {
        if (!entity.id) {
            entity.id = entity.GID;
        }

        if(!entity.workingroupId){
            entity.workingroupId = entity.workingroupid;
        }

        if (!entity.name) {
            entity.name = entity["Basin Name"];
        }
    });
    return data.sort(sortByName);
}

export async function fetchOnsoreGasPipes() {
    let url = assetsBaseUrl + `/data/onshorepower/gaspipes.json`;
    const response = await fetch(url);
    const data = await response.json();
    data.forEach(entity => {
        if (!entity.id) {
            entity.id = entity.Name;
        }

        if (!entity.name) {
            entity.name = entity.Name;
        }

        if (!entity.areaId) {
            entity.areaId = entity.areaid;
        }

        if (!entity.basinId) {
            entity.basinId = entity.basinid;
        }

        if(!entity.workingroupId){
            entity.workingroupId = entity.workingroupid;
        }
        
    });
    return data.filter(entity => entity.id !== null).sort(sortByName);
}

export async function fetchOnsoreWind() {
    let url = assetsBaseUrl + `/data/onshorepower/onshorewind.json`;
    const response = await fetch(url);
    const data = await response.json();
    data.forEach(entity => {
        if (!entity.id) {
            entity.id = entity.Name??entity.Description
        }

        if (!entity.name) {
            entity.name = entity.Name??entity.Description;
        }

        if (!entity.areaId) {
            entity.areaId = entity.areaid;
        }

        if (!entity.basinId) {
            entity.basinId = entity.basinid;
        }

        if(!entity.workingroupId){
            entity.workingroupId = entity.workingroupid;
        }

    });
    return data.filter(entity => entity.id !== null).sort(sortByName);
}

export async function fetchOnsoreGasSites() {
    let url = assetsBaseUrl + `/data/onshorepower/gassites.json`;
    const response = await fetch(url);
    const data = await response.json();
    data.forEach(entity => {
        if (!entity.id) {
            entity.id = entity.Name;
        }

        if (!entity.name) {
            entity.name = entity.Name;
        }

        if (!entity.areaId) {
            entity.areaId = entity.areaid;
        }

        if (!entity.basinId) {
            entity.basinId = entity.basinid;
        }

        if(!entity.workingroupId){
            entity.workingroupId = entity.workingroupid;
        }

    });
    return data.filter(entity => entity.id !== null).sort(sortByName);
}

export async function fetchOnsorePowerlines() {
    let url = assetsBaseUrl + `/data/onshorepower/powerlines.json`;
    const response = await fetch(url);
    const data = await response.json();
    data.forEach(entity => {
        if (!entity.id) {
            entity.id = entity.Name;
        }

        if (!entity.name) {
            entity.name = entity.Name;
        }

        if (!entity.areaId) {
            entity.areaId = entity.areaid;
        }

        if (!entity.basinId) {
            entity.basinId = entity.basinid;
        }

        if(!entity.workingroupId){
            entity.workingroupId = entity.workingroupid;
        }

    });
    return data.filter(entity => entity.id !== null).sort(sortByName);
}

export async function fetchOnsoreGridCables() {
    let url = assetsBaseUrl + `/data/onshorepower/gridcables.json`;
    const response = await fetch(url);
    const data = await response.json();
    data.forEach(entity => {
        if (!entity.id) {
            entity.id = entity.Name;
        }

        if (!entity.name) {
            entity.name = entity.Name;
        }

        if (!entity.areaId) {
            entity.areaId = entity.areaid;
        }

        if (!entity.basinId) {
            entity.basinId = entity.basinid;
        }

        if(!entity.workingroupId){
            entity.workingroupId = entity.workingroupid;
        }

    });
    return data.filter(entity => entity.id !== null).sort(sortByName);
}

export async function fetchWorkingGroups() {
    let url = assetsBaseUrl + `/data/workinggroups.json`;
    const response = await fetch(url);
    const data = await response.json();
    data.forEach(entity => {
        if (!entity.id) {
            entity.id = entity.GID;
        }
        

        if (!entity.name) {
            entity.name = entity["Working group name"];
        }
    });
    return data.filter(entity => entity.id !== null).sort(sortByName);
}

export async function fetchBlocks() {
    let url = assetsBaseUrl + `/data/uk_blocks.json`;
    const response = await fetch(url);
    const data = await response.json();
   if(!Array.isArray(data)){
       return [];
   }
    data.forEach(entity => {
        if (!entity.id) {
            entity.id = entity.GID;
        }
        

        if (!entity.name) {
            entity.name = entity["Block No."];
        }
    });
    return data.filter(entity => entity.id !== null).sort(sortByName);
}




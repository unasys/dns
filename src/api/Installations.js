const assetsBaseUrl = process.env.NODE_ENV === 'development' ? 'https://digitalnorthsea.blob.core.windows.net' : 'https://assets.digitalnorthsea.com';

export async function fetchInstallations() {
    let url = assetsBaseUrl + `/data/installations.json`;
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

        if (!entity.name) {
            entity.name = entity.Name;
        }
    });
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

        if (!entity.name) {
            entity.name = entity.Name;
        }
    });
    return data;
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
            entity.areaIds = entity.Areaid??[];
        }

        if (!entity.basinIds) {
            entity.basinIds = entity.Basinid??[];
        }
        if (!entity.name) {
            entity.name = entity["pipeline_name"];
        }
    });
    return data;
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

        if (!entity.name) {
            entity.name = entity.Name;
        }
    });
    return data;
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

        if (!entity.name) {
            entity.name = entity["Field Name"];
        }
    });
    return data;
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

        if(entity.Geometry.coordinates){
            entity.Geometry.coordinates = entity.Geometry.coordinates.slice(0,2);
        }

        if (!entity.name) {
            entity.name = entity["Well Name"];
        }
    });
    return data;
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

        if (!entity.name) {
            entity.name = entity.Name;
        }
    });
    return data;
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

        if (!entity.name) {
            entity.name = entity["Area Name"];
        }
    });
    return data;
}

export async function fetchBasins() {
    let url = assetsBaseUrl + `/data/basins.json`;
    const response = await fetch(url);
    const data = await response.json();
    data.forEach(entity => {
        if (!entity.id) {
            entity.id = entity.GID;
        }

        if (!entity.name) {
            entity.name = entity["Basin Name"];
        }
    });
    return data;
}

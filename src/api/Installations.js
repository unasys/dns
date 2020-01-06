const assetsBaseUrl = process.env.NODE_ENV === 'development' ? 'https://digitalnorthsea.blob.core.windows.net' : 'https://assets.digitalnorthsea.com';

export async function fetchInstallations() {
    let url = assetsBaseUrl + `/data/installations.json`;
    const response = await fetch(url);
    const data = await response.json();
    data.forEach(entity => {
        if (!entity.id) {
            entity.id = entity.Name;
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
            entity.id = entity["Pipeline Id"];
        }

        if (!entity.name) {
            entity.name = entity["Pipeline Name"];
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
            entity.id = entity.NAME;
        }

        if (!entity.name) {
            entity.name = entity.NAME;
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
            entity.id = entity.ShapeObjectId;
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
    return data;
}

export async function fetchAreas() {
    return [{
        name: "North Sea",
        id: "North Sea",
        sketchfabModels: ["3667f046fdd84437a86404e58af37134"],
        coordinates: { north: 55.0, east: 6.0, south: 42.0, west: -4.0, pitch: -70 },
    }, {
        name: "East of Shetland",
        id: "East of Shetland",
        sketchfabModels: ["4fb208944bab4cf995c4c71958f86d71", "5dc86fb5edaa473cbcc594bc6b4f6889"],
        areaCode: "EOS",
        coordinates: { north: 60.0, east: 7.0, south: 58.0, west: -1.0, pitch: -65 },
    }, {
        name: "Morcambe Bay",
        id: "Morcambe Bay",
        sketchfabModels: ["2da22177e7884d4b95c680d9d0132bdb"],
        areaCode: "MB",
        coordinates: { north: 54.5, east: -3, south: 50.0, west: -6, pitch: -80 }
    }, {
        name: "Moray Firth",
        id: "Moray Firth",
        areaCode: "MF",
        coordinates: { north: 58, east: 2, south: 55.0, west: -7, pitch: -75 }
    }, {
        name: "Northern North Sea",
        id: "Northern North Sea",
        sketchfabModels: ["04be885ac00b44e4b321e50d76f67546"],
        areaCode: "NNS",
        coordinates: { north: 57, east: 10, south: 55.0, west: -7, pitch: -75 }
    }, {
        name: "Southern North Sea",
        id: "Southern North Sea",
        sketchfabModels: ["df135c854ced45a1b74fa9940f3316a0"],
        areaCode: "SNS",
        coordinates: { north: 54.5, east: 4, south: 50.0, west: -1.4, pitch: -80 }
    }, {
        name: "West of Shetland",
        id: "West of Shetland",
        sketchfabModels: ["a29c3d267673403180147d8c543cea01"],
        areaCode: "WOS",
        coordinates: { north: 60.0, east: 0, south: 56.0, west: -7.0, pitch: -75 }
    },
    {
        name: "Central North Sea",
        id: "Central North Sea",
        coordinates: { north: 55, east: 10, south: 54.0, west: -7, pitch: -82 },
        areaCode: "CNS"
    },];
}

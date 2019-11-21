const assetsBaseUrl = process.env.NODE_ENV === 'development' ? 'https://digitalnorthsea.blob.core.windows.net' : 'https://assets.digitalnorthsea.com';

export async function fetchInstallations() {
    let url = assetsBaseUrl + `/data/installations.json`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

export async function fetchDecomyards() {
    let url = assetsBaseUrl + `/data/decomyards/decomyards.json`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

export async function fetchPipelines() {
    let url = assetsBaseUrl + `/data/pipelines/pipelines.json`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

export async function fetchWindfarms() {
    let url = assetsBaseUrl + `/data/windfarms/windfarms.json`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

export async function fetchFields() {
    let url = assetsBaseUrl + `/data/fields/fields.json`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

export async function fetchAreas() {
    return [{
        name: "North Sea",
        sketchfabModels: ["3667f046fdd84437a86404e58af37134"]
    }, {
        name: "East of Shetland",
        sketchfabModels: ["4fb208944bab4cf995c4c71958f86d71","5dc86fb5edaa473cbcc594bc6b4f6889"],
        areaCode:"EOS"
    }, {
        name: "Morcambe Bay",
        sketchfabModels: ["2da22177e7884d4b95c680d9d0132bdb"],
        areaCode:"MB"
    }, {
        name: "Moray Firth",
        areaCode:"MF"
    }, {
        name: "Northern North Sea",
        sketchfabModels: ["04be885ac00b44e4b321e50d76f67546"],
        areaCode:"NNS"
    }, {
        name: "Southern North Sea",
        sketchfabModels: ["df135c854ced45a1b74fa9940f3316a0"],
        areaCode:"SNS"
    }, {
        name: "West of Shetland",
        sketchfabModels: ["a29c3d267673403180147d8c543cea01"],
        areaCode:"WOS"
    }];
}

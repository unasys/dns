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

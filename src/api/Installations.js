import axios from 'axios';

const assetsBaseUrl = process.env.NODE_ENV === 'development' ? 'https://digitalnorthsea.blob.core.windows.net' : 'https://assets.digitalnorthsea.com';

export function fetchInstallations(token) {
    let url = assetsBaseUrl+`/data/installations.json`;

    return axios.get(url, {
        cancelToken: token
    })
}

export function fetchDecomyards(token) {
    let url = assetsBaseUrl+`/data/decomyards/decomyards.json`;

    return axios.get(url, {
        cancelToken: token
    })
}

export function fetchWindfarms(token) {
    let url = assetsBaseUrl+`/data/windfarms/windfarms.json`;

    return axios.get(url, {
        cancelToken: token
    })
}

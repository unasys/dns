import axios from 'axios';

export function fetchInstallations(token) {
    let url = `https://assets.digitalnorthsea.com/data/installations.json`;

    return axios.get(url, {
        cancelToken: token
    })
}

export function fetchDecomyards(token) {
    let url = `https://assets.digitalnorthsea.com/data/decomyards/decomyards.json`;

    return axios.get(url, {
        cancelToken: token
    })
}

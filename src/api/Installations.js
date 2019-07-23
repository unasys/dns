import axios from 'axios';

export function fetchInstallations(token) {
    let url = `https://epmdata.blob.core.windows.net/dnsfiles/installationsv1.json`;

    return axios.get(url, {
        cancelToken: token
    })
}

export function fetchDecomyards(token) {
    let url = `https://epmdata.blob.core.windows.net/dnsfiles/decomyards/decomyards.json`;

    return axios.get(url, {
        cancelToken: token
    })
}

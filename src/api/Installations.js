import axios from 'axios';

export function fetchInstallations(token) {
    let url = `https://epmdata.blob.core.windows.net/dnsfiles/installations.json`;

    return axios.get(url, {
        cancelToken: token
    })
}

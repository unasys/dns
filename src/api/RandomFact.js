import axios from 'axios';

export function fetchFact(token) {
    let url = `https://epmdata.blob.core.windows.net/dnsfiles/homescreenfacts.json`;

    return axios.get(url, {
        cancelToken: token
    })
}

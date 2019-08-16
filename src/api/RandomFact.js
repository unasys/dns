import axios from 'axios';
const assetsBaseUrl = process.env.ENVIRONMENT === 'development' ? 'https://digitalnorthsea.blob.core.windows.net' : 'https://assets.digitalnorthsea.com';
export function fetchFact(token) {
    let url = assetsBaseUrl+`/data/homescreenfacts.json`;

    return axios.get(url, {
        cancelToken: token
    })
}

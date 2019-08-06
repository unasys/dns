import axios from 'axios';

export function fetchFact(token) {
    let url = `https://assets.digitalnorthsea.com/data/homescreenfacts.json`;

    return axios.get(url, {
        cancelToken: token
    })
}

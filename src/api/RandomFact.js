import axios from 'axios';

export function fetchFact(token) {
    let url = `random-fact`;

    return axios.get(url, {
        cancelToken: token
    })
}

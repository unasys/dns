import axios from 'axios';

export function fetchInstallations(token) {
    let url = `installations`;

    return axios.get(url, {
        cancelToken: token
    })
}

import axios from 'axios';

export function fetchLocations(projectId, token, offset, fetch) {
    let url = `/projects/${projectId}/locations`;

    if (offset !== undefined && fetch !== undefined) {
        url += `?offset=${offset}&fetch=${fetch}`;
    }

    return axios.get(url, {
        cancelToken: token
    })
}

export function createNewLocation(projectId, body, token) {
    let url = `/projects/${projectId}/locations`;

    return axios.post(url, body,
        {
            headers: { 'Content-Type': 'application/json' }, cancelToken: token
        })
}


export function moveLocationsArea(projectId, locationId, body, token) {
    let url = `/projects/${projectId}/locations/${locationId}/move-to-area`

    return axios.post(url, body,
        {
            headers: { 'Content-Type': 'application/json' }, cancelToken: token
        })
}
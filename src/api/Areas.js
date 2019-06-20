import axios from 'axios';

export function fetchAreas(projectId, token, offset, fetch) {
    let url = `/projects/${projectId}/areas`;

    if (offset !== undefined && fetch !== undefined) {
        url += `?offset=${offset}&fetch=${fetch}`;
    }

    return axios.get(url, {
        cancelToken: token
    })
}

export function fetchArea(projectId, areaId, token) {
    let url = `/projects/${projectId}/areas/${areaId}`;

    return axios.get(url, {
        cancelToken: token
    })
}

export function createNewArea(projectId, body, token) {
    let url = `/projects/${projectId}/areas`;

    return axios.post(url, body,
        {
            headers: { 'Content-Type': 'application/json' }, cancelToken: token
        })
}


export function moveAreasModule(projectId, areaId, body, token) {
    let url = `/projects/${projectId}/areas/${areaId}/move-to-module`

    return axios.post(url, body,
        {
            headers: { 'Content-Type': 'application/json' }, cancelToken: token
        })
}
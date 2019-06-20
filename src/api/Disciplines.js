import axios from 'axios';

export function fetchDisciplines(projectId, token, offset, fetch) {
    let url = `/projects/${projectId}/disciplines`;

    if (offset !== undefined && fetch !== undefined) {
        url += `?offset=${offset}&fetch=${fetch}`;
    }

    return axios.get(url, {
        cancelToken: token
    })
}

export function fetchDiscipline(projectId, disciplineId, token) {
    let url = `/projects/${projectId}/disciplines/${disciplineId}`;

    return axios.get(url, {
        cancelToken: token
    })
}

export function createNewDiscipline(projectId, body, token) {
    let url = `/projects/${projectId}/disciplines`;

    return axios.post(url, body,
        {
            headers: { 'Content-Type': 'application/json' }, cancelToken: token
        })
}
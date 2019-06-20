import axios from 'axios';

export function fetchModules(projectId, token, offset, fetch) {
    let url = `/projects/${projectId}/modules`;

    if (offset !== undefined && fetch !== undefined) {
        url += `?offset=${offset}&fetch=${fetch}`;
    }

    return axios.get(url, {
        cancelToken: token
    })
}

export function fetchModule(projectId, moduleId, token) {
    return axios.get(`/projects/${projectId}/modules/${moduleId}`, {
        cancelToken: token
    })
}

export function createNewModule(projectId, body, token) {
    let url = `/projects/${projectId}/modules`;

    return axios.post(url, body,
        {
            headers: { 'Content-Type': 'application/json' }, cancelToken: token
        })
}

export function moveModuleFacility(projectId, moduleId, body, token) {
    let url = `/projects/${projectId}/modules/${moduleId}/move-to-facility`

    return axios.post(url, body,
        {
            headers: { 'Content-Type': 'application/json' }, cancelToken: token
        })
}
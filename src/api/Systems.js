import axios from 'axios';

export function fetchSystemCountCall(projectId, system, token) {
    return axios.get(`/projects/${projectId}/tags?systemId=${system.id}&fetch=1`, {
        cancelToken: token
    })
}

export function fetchSystemsCall(projectId, token, offset, fetch) {
    let url = `/projects/${projectId}/systems`;
    if (offset !== undefined && fetch !== undefined) {
        url += `?offset=${offset}&fetch=${fetch}`;
    }

    return axios.get(url, {
        cancelToken: token
    })
}

export function fetchSystemsByProductionUnit(projectId, token, offset, fetch, productionUnitId) {
    let url = `/projects/${projectId}/systems?productionUnit=${productionUnitId}`;
    if (offset !== undefined && fetch !== undefined) {
        url += `&offset=${offset}&fetch=${fetch}`;
    }

    return axios.get(url, {
        cancelToken: token
    })
}

export function fetchSystemCall(projectId, systemId, token) {
    let url = `/projects/${projectId}/systems/${systemId}`;
    return axios.get(url, {
        cancelToken: token
    })
}

export function createNewSystemCall(projectId, body, token) {
    return axios.post(`/projects/${projectId}/systems`,
        body,
        {
            headers: { 'Content-Type': 'application/json' }, cancelToken: token
        })
}

export function updateSystemsStatus(projectId, systemId, body, token) {
    return axios.post(`/projects/${projectId}/systems/${systemId}/assign-status`,
        body,
        {
            headers: { 'Content-Type': 'application/json' }, cancelToken: token
        })
}

export function updateSystemProductionUnit(projectId, systemId, body, token) {
    return axios.post(`/projects/${projectId}/systems/${systemId}/assign-production-unit`,
        body,
        {
            headers: { 'Content-Type': 'application/json' }, canelToken: token
        })
}
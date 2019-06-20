import axios from 'axios';

export function fetchSubsystemsCall(projectId, token, offset, fetch) {
    let url = `/projects/${projectId}/subsystems`;
    if (offset !== undefined && fetch !== undefined) {
        url += `?offset=${offset}&fetch=${fetch}`;
    }
    return axios.get(url, {
        cancelToken: token
    })
}

export function fetchSubsystemsBySystemCall(projectId, systemId, token, offset, fetch) {
    let url = `/projects/${projectId}/subsystems?systemId=${systemId}`;
    if (offset !== undefined && fetch !== undefined) {
        url += `&offset=${offset}&fetch=${fetch}`;
    }
    return axios.get(url, {
        cancelToken: token
    })
}

export function createNewSubsystemCall(projectId, body, token) {
    return axios.post(`/projects/${projectId}/subsystems`,
        body,
        {
            headers: { 'Content-Type': 'application/json' }, cancelToken: token
        })
}

export function updateSubsystemsSystem(projectId, subsystemId, body, token) {
    return axios.post(`projects/${projectId}/subsystems/${subsystemId}/move-to-system`,
        body,
        {
            headers: { 'Content-Type': 'application/json' }, cancelToken: token
        })
}

export function fetchSubsystemCall(projectId, subsystemId, token) {
    let url = `/projects/${projectId}/subsystems/${subsystemId}`;
    return axios.get(url, {
        cancelToken: token
    })
}
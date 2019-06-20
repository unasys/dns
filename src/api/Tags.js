import axios from 'axios';

export function fetchTags(projectId, token, offset, fetch) {
    let url = `/projects/${projectId}/tags`;

    if (offset !== undefined && fetch !== undefined) {
        url += `?offset=${offset}&fetch=${fetch}`;
    }

    return axios.get(url, {
        cancelToken: token
    })
}

export function createNewTag(projectId, body, token) {
    let url = `/projects/${projectId}/tags`;

    return axios.post(url, body,
        {
            headers: { 'Content-Type': 'application/json' }, cancelToken: token
        })
}

export function moveToSubsystem(projectId, tagId, body, token) {
    let url = `/projects/${projectId}/tags/${tagId}/move-to-subsystem`;

    return axios.post(url, body,
        {
            headers: { 'Content-Type': 'application/json' }, cancelToken: token
        })
}

export function updateCondition(projectId, tagId, body, token) {
    let url = `/projects/${projectId}/tags/${tagId}/assign-condition`;

    return axios.post(url, body,
        {
            headers: { 'Content-Type': 'application/json' }, cancelToken: token
        })
}

export function updateCriticality(projectId, tagId, body, token) {
    let url = `/projects/${projectId}/tags/${tagId}/assign-criticality`;

    return axios.post(url, body,
        {
            headers: { 'Content-Type': 'application/json' }, cancelToken: token
        })
}

export function updateStatus(projectId, tagId, body, token) {
    let url = `/projects/${projectId}/tags/${tagId}/assign-status`

    return axios.post(url, body,
        {
            headers: { 'Content-Type': 'application/json' }, cancelToken: token
        })
}

export function updateEquipmentType(projectId, tagId, body, token) {
    let url = `/projects/${projectId}/tags/${tagId}/assign-to-equipment-type`

    return axios.post(url, body,
        {
            headers: { 'Content-Type': 'application/json' }, cancelToken: token
        })
}
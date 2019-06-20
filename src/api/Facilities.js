import axios from 'axios';

export function fetchFacilities(projectId, token, offset, fetch) {
    let url = `/projects/${projectId}/facilities`;

    if (offset !== undefined && fetch !== undefined) {
        url += `?offset=${offset}&fetch=${fetch}`;
    }

    return axios.get(url, {
        cancelToken: token
    })
}

export function fetchFacility(projectId, facilityId, token) {
    return axios.get(`/projects/${projectId}/facilities/${facilityId}`, {
        cancelToken: token
    })
}

export function createNewFacility(projectId, body, token) {
    let url = `/projects/${projectId}/facilities`;

    return axios.post(url, body,
        {
            headers: { 'Content-Type': 'application/json' }, cancelToken: token
        })
}
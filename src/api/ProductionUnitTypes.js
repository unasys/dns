import axios from 'axios';

export function fetchProductionUnitTypes(projectId, token, offset, fetch) {
    let url = `/projects/${projectId}/production-unit-types`;

    if (offset !== undefined && fetch !== undefined) {
        url += `?offset=${offset}&fetch=${fetch}`;
    }

    return axios.get(url, {
        cancelToken: token
    })
}

export function fetchProductionUnitType(projectId, productionUnitTypeId, token) {
    return axios.get(`/projects/${projectId}/production-unit-types/${productionUnitTypeId}`, {
        cancelToken: token
    })
}

export function createNewProductionUnitType(projectId, body, token) {
    let url = `/projects/${projectId}/production-unit-types`;

    return axios.post(url, body,
        {
            headers: { 'Content-Type': 'application/json' }, cancelToken: token
        })
}
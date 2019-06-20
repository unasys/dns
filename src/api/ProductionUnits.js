import axios from 'axios';

export function fetchProductionUnitsCall(projectId, token, offset, fetch) {
    let url = `/projects/${projectId}/production-units`;

    if (offset !== undefined && fetch !== undefined) {
        url += `?offset=${offset}&fetch=${fetch}`;
    }

    return axios.get(url, {
        cancelToken: token
    })
}

//wait until we have production unit by X for counts
// export function fetchProductionUnitCount(projectId, token) {
//     let url = `/projects/${projectId}/production-units`;

//     return axios.get(url, {
//         cancelToken: token
//     })
// }

export function fetchProductionUnit(projectId, productionUnitId, token) {
    return axios.get(`/projects/${projectId}/production-units/${productionUnitId}`, {
        cancelToken: token
    })
}

export function createNewProductionUnitCall(projectId, body, token) {
    let url = `/projects/${projectId}/production-units`;

    return axios.post(url, body,
        {
            headers: { 'Content-Type': 'application/json' }, cancelToken: token
        })
}

export function updateProductionUnitsType(projectId, productionUnitId, body, token) {
    let url = `/projects/${projectId}/production-units/${productionUnitId}/move-to-type`

    return axios.post(url, body,
        {
            headers: { 'Content-Type': 'application/json' }, cancelToken: token
        })
}
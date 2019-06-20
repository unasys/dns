import axios from 'axios';

export function fetchEquipmentTypes(projectId, token, offset, fetch) {
    let url = `/projects/${projectId}/equipment-types`;

    if (offset !== undefined && fetch !== undefined) {
        url += `?offset=${offset}&fetch=${fetch}`;
    }

    return axios.get(url, {
        cancelToken: token
    })
}

export function fetchEquipmentTypeCall(projectId, equipmentTypeId, token) {
    let url = `/projects/${projectId}/equipment-types/${equipmentTypeId}`;
    return axios.get(url, {
        cancelToken: token
    })
}

export function createNewEquipmentType(projectId, body, token) {
    let url = `/projects/${projectId}/equipment-types`;

    return axios.post(url, body,
        {
            headers: { 'Content-Type': 'application/json' }, cancelToken: token
        })
}

export function moveEquipmentTypesDiscipline(projectId, equipmentTypeId, body, token) {
    let url = `/projects/${projectId}/equipment-types/${equipmentTypeId}`

    return axios.put(url, body,
        {
            headers: { 'Content-Type': 'application/json' }, cancelToken: token
        })
}
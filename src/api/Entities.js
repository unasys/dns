import axios from 'axios';

export function getAuxiliaryData(projectId, entityId, token) {
    let url = `/projects/${projectId}/entities/${entityId}/auxiliary-data`;
    return axios.get(url, {
        cancelToken: token
    })
}

export function getAuxiliaryDataImage(projectId, entityId, imageId, token) {
    let url = `/projects/${projectId}/entities/${entityId}/auxiliary-data/${imageId}/image`;
    return axios.get(url, {
        cancelToken: token
    })
}
import axios from 'axios';

export function fetchDocumentTypes(projectId, token, offset, fetch) {
    let url = `/projects/${projectId}/document-types`;

    if (offset !== undefined && fetch !== undefined) {
        url += `?offset=${offset}&fetch=${fetch}`;
    }

    return axios.get(url, {
        cancelToken: token
    })
}

export function fetchDocumentType(projectId, documentTypeId, token) {
    return axios.get(`/projects/${projectId}/document-types/${documentTypeId}`, {
        cancelToken: token
    })
}

export function createNewDocumentType(projectId, body, token) {
    let url = `/projects/${projectId}/document-types`;

    return axios.post(url, body,
        {
            headers: { 'Content-Type': 'application/json' }, cancelToken: token
        })
}
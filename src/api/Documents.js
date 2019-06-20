import axios from 'axios';

export function fetchDocumentsCall(projectId, token, labels, offset, fetch, documentTypeId, references) {
    let url;
    let firstParam = true;
    if (!labels || labels.length === 0) {
        url = `/projects/${projectId}/documents`;
    } else {
        firstParam = false;
        url = `/projects/${projectId}/documents?labels=${encodeURIComponent(labels.join(";"))}`;
    }

    if (documentTypeId) {
        if (firstParam) {
            firstParam = false;
            url += `?document-type=${documentTypeId}`
        } else {
            url += `&document-type=${documentTypeId}`
        }
    }

    if (references) {
        if (firstParam) {
            firstParam = false;
            url += `?references=${references}`
        } else {
            url += `&references=${references}`
        }
    }

    if (offset !== undefined && fetch !== undefined) {
        if (firstParam) {
            firstParam = false;
            url += `?offset=${offset}&fetch=${fetch}`;
        } else {
            url += `&offset=${offset}&fetch=${fetch}`;
        }
    }

    return axios.get(url, {
        cancelToken: token
    })
}

export function getUnAuthedContentFromBlob(url, token) {
    return axios.get(url,
        {
            transformRequest: [(data, headers) => {
                delete headers.common.Authorization
                return data
            }]
        },
        {
            cancelToken: token
        })
}

export function getContentForDocument(url, token) {
    return axios.get(url,
        {
            cancelToken: token
        })
}

export function createNewDocumentCall(projectId, body, token) {
    return axios.post(`/projects/${projectId}/documents`,
        body,
        { headers: { 'Content-Type': 'multipart/form-data' } }, { cancelToken: token })
}

export function getAllLabels(projectId, token) {
    let url = `/projects/${projectId}/documents/labels`
    return axios.get(url, {
        cancelToken: token
    })
}

export function fetchEntityDocuments(projectId, entityId, token) {
    return axios.get(`/projects/${projectId}/documents?references=${entityId}`, {
        cancelToken: token
    })
}

export function updateDocumentsType(projectId, documentId, body, token) {
    let url = `/projects/${projectId}/documents/${documentId}/assign-document-type`

    return axios.post(url, body,
        {
            headers: { 'Content-Type': 'application/json' }, cancelToken: token
        })
}

export function updateDocument(projectId, documentId, body, token) {
    let url = `/projects/${projectId}/documents/${documentId}/update-document`

    return axios.post(url, body,
        {
            headers: { 'Content-Type': 'application/json' }, cancelToken: token
        })
}
import axios from 'axios';

export function getLabels(projectId, label, token) {    
    let url = `/projects/${projectId}/documents`
    if (label) {
        url += `?labels=${label}`
    } else {
        url += '/labels'
    }
    return axios.get(url, {
        cancelToken: token
    })
}

export function getLabelsByDocumentGroup(projectId, docGroup, token) {
    let url = `projects/${projectId}/documents/labels?labels=Document%20Group`
    if (docGroup) {
        url += `=${docGroup}`
    }
    return axios.get(url, {
        cancelToken: token
    })
}
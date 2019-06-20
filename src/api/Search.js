import axios from 'axios';

export function search(projectId, token, query, entityType) {
    let url;
    if (entityType) {
        url = `/projects/${projectId}/search?query=${query}&entityType=${entityType}`;
    } else {
        url = `/projects/${projectId}/search?query=${query}`;
    }

    return axios.get(url, {
        cancelToken: token
    })
}

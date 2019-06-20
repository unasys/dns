import axios from 'axios';

export function fetchProjectConfig(projectId, token) {
    if (projectId === null || projectId === '') return;
    return axios.get(`/projects/${projectId}/config`, {
        cancelToken: token
    })
}
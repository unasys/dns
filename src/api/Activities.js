import axios from 'axios';

export function fetchActivitiesCall(url, token) {
    return axios.get(url, {
        cancelToken: token
    })
}

export function fetchEntityActivities(projectId, entityId, token) {
    return axios.get(`/projects/${projectId}/test-procedures?entityId=${entityId}`, { // temp endpoint
        cancelToken: token
    })
}
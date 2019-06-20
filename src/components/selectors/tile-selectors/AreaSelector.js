import React from 'react';
import update from 'immutability-helper';
import axios from 'axios';
import queryString from 'query-string';

const CancelToken = axios.CancelToken;

class AreaSelector extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            areas: [],
            isLoading: true
        }
        this.source = CancelToken.source();
    }

    componentDidMount() {
        this.fetchAreas(this.props.projectId, this.props.urlParams, 0, 1000); // for now
    }

    componentWillUnmount() {
        this.source.cancel();
    }

    fetchAreaDocumentCount(projectId, area, index) {
        axios.get(`/projects/${projectId}/documents?references=${area.id}&fetch=1`, {
            cancelToken: this.source.token
        })
            .then(payload => {
                this.setState({
                    areas: update(this.state.areas, { [index]: { count: { $set: payload.data.total } } })
                })
            }).catch((e) => {
                if (!axios.isCancel(e)) {
                    console.error('something went wrong when fetching areas in areasselector.js', e);
                }
            })
    }

    fetchAreaTagCount(projectId, area, index) {
        axios.get(`/projects/${projectId}/tags?areaId=${area.id}&fetch=1`, {
            cancelToken: this.source.token
        })
            .then(payload => {
                this.setState({
                    areas: update(this.state.areas, { [index]: { count: { $set: payload.data.total } } })
                })
            }).catch((e) => {
                if (!axios.isCancel(e)) {
                    console.error('something went wrong when fetching areas in areasselector.js', e);
                }
            })
    }

    // moduleObj, facility
    fetchAreas(projectId, urlParams, offset, fetch) {
        let url = `/projects/${projectId}/areas`
        let urlParamsStr = queryString.stringify(urlParams);

        if (urlParamsStr.length !== 0) {
            url += `?${urlParamsStr}&offset=${offset}&fetch=${fetch}`;
        } else {
            url += `?offset=${offset}&fetch=${fetch}`
        }

        axios.get(url, {
            cancelToken: this.source.token
        })
            .then(payload => {
                this.setState({
                    isLoading: false,
                    areas: payload.data._embedded.items,
                    totalAreas: payload.data.total
                });
                return payload;
            }).then(payload => {
                // eslint-disable-next-line
                payload.data._embedded.items.map((area, i) => {
                    if (this.props.docCount) {
                        this.fetchAreaDocumentCount(projectId, area, i);
                    }
                    if (this.props.tagCount) {
                        this.fetchAreaTagCount(projectId, area, i);
                    }
                })
            })
            .catch((e) => {
                if (!axios.isCancel(e)) {
                    console.log('something went wrong when fetching installations in moduleselector.js');
                }
            })
    }


    render() {
        return (
            this.props.onRender(this.state.areas)
        )
    }
}

export default AreaSelector;

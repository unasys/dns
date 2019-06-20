import React from 'react';
import { fetchSystemCountCall } from '../../../api/Systems';
import update from 'immutability-helper';
import axios from 'axios';
import queryString from 'query-string';

const CancelToken = axios.CancelToken;

class SystemSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            systems: [],
            isLoading: true,
            totalSystems: null
        }
        this.source = CancelToken.source();
    }

    fetchSystemCount(projectId, system, index) {
        fetchSystemCountCall(projectId, system, this.source.token)
            .then(payload => {
                this.setState({
                    systems: update(this.state.systems, { [index]: { count: { $set: payload.data.total } } })
                })
            }).catch((e) => {
                if (!axios.isCancel(e)) {
                    console.log('something went wrong when fetching installations in systemsselector.js');
                }
            })
    }

    fetchSystemDocumentCount(projectId, system, index) {
        axios.get(`/projects/${projectId}/documents?references=${system.id}&fetch=1`, {
            cancelToken: this.source.token
        })
            .then(payload => {
                this.setState({
                    systems: update(this.state.systems, { [index]: { count: { $set: payload.data.total } } })
                })
            }).catch((e) => {
                if (!axios.isCancel(e)) {
                    console.log('something went wrong when fetching installations in systemsselector.js');
                }
            })
    }

    fetchSystems(projectId, urlParams, offset, fetch) {
        let url = `/projects/${projectId}/systems`
        let urlParamsStr = queryString.stringify(urlParams);

        if (urlParamsStr.length !== 0) {
            url += `?${urlParamsStr}&offset=${offset}&fetch=${fetch}`;
        } else {
            url += `?offset=${offset}&fetch=${fetch}`
        }
        axios.get(url, {
            cancelToken: this.source.token
        }).then(payload => {
            this.setState({
                systems: payload.data._embedded.items,
                totalSystems: payload.data.total,
                isLoading: false
            });
            return payload;
        }).then(payload => {
            // eslint-disable-next-line
            payload.data._embedded.items.map((system, i) => {
                if (this.props.tagCount) {
                    this.fetchSystemCount(projectId, system, i);
                }
                if (this.props.docCount) {
                    this.fetchSystemDocumentCount(projectId, system, i);
                }
            })
        })
            .catch((e) => {
                if (!axios.isCancel(e)) {
                    console.log('something went wrong when fetching installations in systemsselector.js');
                }
            })
    }

    componentDidMount() {
        this.fetchSystems(this.props.projectId, this.props.urlParams, 0, 1000); // for now
    }

    componentWillUnmount() {
        this.source.cancel()
    }

    render() {
        return (
            this.props.onRender(this.state.systems)
        )
    }
}

export default SystemSelector;

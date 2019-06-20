import React from 'react';
import queryString from 'query-string';
import update from 'immutability-helper';
import axios from 'axios';

const CancelToken = axios.CancelToken;

class ModuleSelector extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            modules: [],
            isLoading: true
        }
        this.source = CancelToken.source();
    }

    componentDidMount() {
        this.fetchModules(this.props.projectId, this.props.urlParams, 0, 1000) // for now.
    }

    componentWillUnmount() {
        this.source.cancel();
    }

    fetchModuleDocumentCount(projectId, moduleParam, index) {
        axios.get(`/projects/${projectId}/documents?references=${moduleParam.id}&fetch=1`, {
            cancelToken: this.source.token
        })
            .then(payload => {
                this.setState({
                    modules: update(this.state.modules, { [index]: { count: { $set: payload.data.total } } })
                })
            }).catch((e) => {
                if (!axios.isCancel(e)) {
                    console.error('something went wrong when fetching modules in modulesselector.js', e);
                }
            })
    }

    fetchModuleTagCount(projectId, moduleParam, index) {
        axios.get(`/projects/${projectId}/tags?moduleId=${moduleParam.id}&fetch=1`, {
            cancelToken: this.source.token
        })
            .then(payload => {
                this.setState({
                    modules: update(this.state.modules, { [index]: { count: { $set: payload.data.total } } })
                })
            }).catch((e) => {
                if (!axios.isCancel(e)) {
                    console.error('something went wrong when fetching modules in modulesselector.js', e);
                }
            })
    }

    fetchModules(projectId, urlParams, offset, fetch) {
        let url = `/projects/${projectId}/modules`;
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
                    modules: payload.data._embedded.items,
                    totalModules: payload.data.total
                });
                return payload;
            }).then(payload => {
                // eslint-disable-next-line
                payload.data._embedded.items.map((moduleParam, i) => {
                    if (this.props.docCount) {
                        this.fetchModuleDocumentCount(projectId, moduleParam, i);
                    }

                    if (this.props.tagCount) {
                        this.fetchModuleTagCount(projectId, moduleParam, i);
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
            this.props.onRender(this.state.modules)
        )
    }
}

export default ModuleSelector;

import React from 'react';
import ResultItem from '../result-item/ResultItem';
import NoResultItem from '../result-item/NoResultItem';
import queryString from 'query-string';
import InfiniteScroll from 'react-infinite-scroller';
import update from 'immutability-helper';
import axios from 'axios';

const CancelToken = axios.CancelToken;

class ModuleSelector extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            modules: [],
            modulePageAmount: 50,
            hasMoreModules: true,
            totalModules: null,
            isLoading: true
        }
        this.source = CancelToken.source();
        this.loadMoreModules = this.loadMoreModules.bind(this);
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

    loadMoreModules(page) {
        let newModuleIndex = this.state.modulePageAmount * page
        if (this.state.totalModules && newModuleIndex >= this.state.totalModules) {
            this.setState({
                hasMoreModules: false
            })
        }
        this.fetchModules(this.props.projectId, this.props.urlParams, 0, newModuleIndex);
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
        let moduleItems =
            this.state.modules.map(moduleItem => {
                return <ResultItem key={moduleItem.id} content={moduleItem.name + " - " + moduleItem.detail} count={moduleItem.count} contentOnClick={this.props.onModuleSelected.bind(this, moduleItem)}></ResultItem>;
            })

        let infiniteModules = (
            <div className="infinity-scroll-container">
                <InfiniteScroll
                    pageStart={0}
                    loadMore={this.loadMoreModules}
                    hasMore={this.state.hasMoreModules}
                    loader={<div className="infinity-scroll-loader">Loading...</div>}
                    useWindow={false}>
                    {moduleItems}
                </InfiniteScroll>)
            </div>);

        return (
            (this.state.modules.length === 0 && this.state.isLoading === false) ? <NoResultItem></NoResultItem> : infiniteModules
        );
    }
}

export default ModuleSelector;

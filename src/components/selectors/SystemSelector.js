import React from 'react';
import { fetchSystemCountCall } from '../../api/Systems';
import update from 'immutability-helper';
import axios from 'axios';
import queryString from 'query-string';
import '../visuals/loading/InfinityScroll.scss';
import ResultItem from '../result-item/ResultItem';
import NoResultItem from '../result-item/NoResultItem';
import InfiniteScroll from 'react-infinite-scroller';

const CancelToken = axios.CancelToken;

class SystemSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            systems: [],
            isLoading: true,
            systemPageAmount: 50,
            hasMoreSystems: true,
            totalSystems: null
        }
        this.source = CancelToken.source();
        this.loadMoreSystems = this.loadMoreSystems.bind(this);
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

    loadMoreSystems(page) {
        let newSystemsIndex = this.state.systemPageAmount * page
        if (this.state.totalSystems && newSystemsIndex >= this.state.totalSystems) {
            this.setState({
                hasMoreSystems: false
            })
        }
        this.fetchSystems(this.props.projectId, this.props.urlParams, 0, newSystemsIndex);
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

    componentWillUnmount() {
        this.source.cancel()
    }

    render() {
        let systemItems =
            this.state.systems.map(system => {
                return <ResultItem key={system.id} content={system.name + " - " + system.detail} count={system.count} contentOnClick={this.props.onSystemSelected.bind(this, system)} status={system.status}></ResultItem>;
            })

        let infiniteSystems =
            <div className="infinity-scroll-container">
                <InfiniteScroll
                    pageStart={0}
                    loadMore={this.loadMoreSystems}
                    hasMore={this.state.hasMoreSystems}
                    loader={<div className="infinity-scroll-loader">Loading...</div>}
                    useWindow={false}>
                    {systemItems}
                </InfiniteScroll>
            </div>

        return (
            (this.state.systems.length === 0 && this.state.isLoading === false) ? <NoResultItem></NoResultItem> : infiniteSystems
        );
    }
}

export default SystemSelector;

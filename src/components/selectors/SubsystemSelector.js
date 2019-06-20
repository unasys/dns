import React from 'react';
import ResultItem from '../result-item/ResultItem';
import NoResultItem from '../result-item/NoResultItem';
import axios from 'axios';
import queryString from 'query-string';
import update from 'immutability-helper';
import InfiniteScroll from 'react-infinite-scroller';
import '../visuals/loading/InfinityScroll.scss';

const CancelToken = axios.CancelToken;

class SubsystemSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            subsystems: [],
            isLoading: true,
            subsystemPageAmount: 50,
            hasMoreSubsystems: true,
            totalSubsystems: null
        }
        this.source = CancelToken.source();
        this.loadMoreSubsystems = this.loadMoreSubsystems.bind(this);
    }

    componentWillUnmount() {
        this.source.cancel();
    }

    fetchSubsystemTagCount(projectId, subsystem, index) {
        axios.get(`/projects/${projectId}/tags?subsystemId=${subsystem.id}&fetch=1`,
            {
                cancelToken: this.source.token
            })
            .then(payload => {
                this.setState({
                    subsystems: update(this.state.subsystems, { [index]: { count: { $set: payload.data.total } } })
                })
            }).catch((e) => {
                if (!axios.isCancel(e)) {
                    console.error('something went wrong when fetching installations in subsystemselector.js', e);
                }
            })
    }

    loadMoreSubsystems(page) {
        let newSubsystemIndex = this.state.subsystemPageAmount * page
        if (this.state.subsystemPageAmount && newSubsystemIndex >= this.state.subsystemPageAmount) {
            this.setState({
                hasMoreSubsystems: false
            })
        }
        this.fetchSubsystem(this.props.projectId, this.props.urlParams, 0, newSubsystemIndex);
    }

    fetchSubsystem(projectId, urlParams, offset, fetch) {
        let url = `/projects/${projectId}/subsystems`
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
                isLoading: false,
                totalSubsystems: payload.data.total,
                subsystems: payload.data._embedded.items
            });
            return payload;
        }).then(payload => {
            // eslint-disable-next-line
            payload.data._embedded.items.map((subsystem, i) => {
                if (this.props.tagCount) {
                    this.fetchSubsystemTagCount(projectId, subsystem, i);
                }
            })
        })
            .catch((e) => {
                if (!axios.isCancel(e)) {
                    console.error('something went wrong when fetching installations in subsystemselector.js', e);
                }
            })
    }

    render() {
        let subsystemItems =
            this.state.subsystems.map(subsystem => {
                return <ResultItem key={subsystem.id} content={subsystem.detail} count={subsystem.count} contentOnClick={this.props.onSubsystemSelected.bind(this, subsystem)}></ResultItem>;
            })

        let infiniteSubsystems = (
            <div className="infinity-scroll-container">
                <InfiniteScroll
                    pageStart={0}
                    loadMore={this.loadMoreSubsystems}
                    hasMore={this.state.hasMoreSubsystems}
                    loader={<div className="infinity-scroll-loader">Loading...</div>}
                    useWindow={false}>
                    {subsystemItems}
                </InfiniteScroll>
            </div>)

        return (
            (this.state.subsystems.length === 0 && this.state.isLoading === false) ? <NoResultItem></NoResultItem> : infiniteSubsystems
        );
    }
}

export default SubsystemSelector;

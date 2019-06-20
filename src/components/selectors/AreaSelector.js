import React from 'react';
import ResultItem from '../result-item/ResultItem';
import update from 'immutability-helper';
import axios from 'axios';
import queryString from 'query-string';
import InfiniteScroll from 'react-infinite-scroller';
import NoResultItem from '../result-item/NoResultItem';

const CancelToken = axios.CancelToken;

class AreaSelector extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            areas: [],
            areaPageAmount: 50,
            hasMoreAreas: true,
            totalAreas: null,
            isLoading: true
        }
        this.source = CancelToken.source();
        this.loadMoreAreas = this.loadMoreAreas.bind(this);
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

    loadMoreAreas(page) {
        let newAreaIndex = this.state.areaPageAmount * page
        if (this.state.totalAreas && newAreaIndex >= this.state.totalAreas) {
            this.setState({
                hasMoreAreas: false
            })
        }
        this.fetchAreas(this.props.projectId, this.props.urlParams, 0, newAreaIndex);
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
        let areaItems =
            this.state.areas.map(area => {
                return <ResultItem key={area.id} content={area.name + " - " + area.detail} count={area.count} contentOnClick={this.props.onAreaSelected.bind(this, area)}></ResultItem>;
            })

        let infiniteAreas = (
            <div className="infinity-scroll-container">
                <InfiniteScroll
                    pageStart={0}
                    loadMore={this.loadMoreAreas}
                    hasMore={this.state.hasMoreAreas}
                    loader={<div className="infinity-scroll-loader">Loading...</div>}
                    useWindow={false}>
                    {areaItems}
                </InfiniteScroll>)
            </div>);

        return (
            (this.state.areas.length === 0 && this.state.isLoading === false) ? <NoResultItem></NoResultItem> : infiniteAreas
        );
    }
}

export default AreaSelector;

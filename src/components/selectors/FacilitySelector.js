import React from 'react';
import NoResultItem from '../result-item/NoResultItem';
import ResultItem from '../result-item/ResultItem';
import queryString from 'query-string';
import InfiniteScroll from 'react-infinite-scroller';
import update from 'immutability-helper';
import axios from 'axios';

const CancelToken = axios.CancelToken;

class FacilitySelector extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            facilities: [],
            facilityPageAmount: 50,
            hasMoreFacilities: true,
            totalFacilities: null,
            isLoading: true
        }
        this.source = CancelToken.source();
        this.loadMoreFacilities = this.loadMoreFacilities.bind(this);
    }

    componentWillUnmount() {
        this.source.cancel();
    }

    fetchFacilitiesDocumentCount(projectId, facility, index) {
        axios.get(`/projects/${projectId}/documents?references=${facility.id}&fetch=1`, {
            cancelToken: this.source.token
        })
            .then(payload => {
                this.setState({
                    facilities: update(this.state.facilities, { [index]: { count: { $set: payload.data.total } } })
                })
            }).catch((e) => {
                if (!axios.isCancel(e)) {
                    console.error('something went wrong when fetching facilities in facilityselector.js', e);
                }
            })
    }

    fetchFacilitiesTagCount(projectId, facility, index) {
        axios.get(`/projects/${projectId}/tags?facilityId=${facility.id}&fetch=1`, {
            cancelToken: this.source.token
        })
            .then(payload => {
                this.setState({
                    facilities: update(this.state.facilities, { [index]: { count: { $set: payload.data.total } } })
                })
            }).catch((e) => {
                if (!axios.isCancel(e)) {
                    console.error('something went wrong when fetching facilities in facilityselector.js', e);
                }
            })
    }

    loadMoreFacilities(page) {
        let newFacilityIndex = this.state.facilityPageAmount * page
        if (this.state.totalFacilities && newFacilityIndex >= this.state.totalFacilities) {
            this.setState({
                hasMoreFacilities: false
            })
        }
        this.fetchFacilities(this.props.projectId, this.props.urlParams, 0, newFacilityIndex);
    }

    fetchFacilities(projectId, urlParams, offset, fetch) {
        let url = `/projects/${projectId}/facilities`
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
                    facilities: payload.data._embedded.items,
                    totalFacilities: payload.data.total,
                });
                return payload;
            }).then(payload => {
                // eslint-disable-next-line
                payload.data._embedded.items.map((facility, i) => {
                    if (this.props.docCount) {
                        this.fetchFacilitiesDocumentCount(projectId, facility, i);
                    }

                    if (this.props.tagCount) {
                        this.fetchFacilitiesTagCount(projectId, facility, i);
                    }
                })
            })
            .catch((e) => {
                if (!axios.isCancel(e)) {
                    console.error('something went wrong when fetching facilities in facilitiesselector.js', e);
                }
            })
    }

    render() {
        let facilityItems =
            this.state.facilities.map(facility => {
                return <ResultItem key={facility.id} content={facility.name} count={facility.count} contentOnClick={this.props.onFacilitySelected.bind(this, facility)}></ResultItem>;
            })

        let infiniteFacilities = (
            <div className="infinity-scroll-container">
                <InfiniteScroll
                    pageStart={0}
                    loadMore={this.loadMoreFacilities}
                    hasMore={this.state.hasMoreFacilities}
                    loader={<div className="infinity-scroll-loader">Loading...</div>}
                    useWindow={false}>
                    {facilityItems}
                </InfiniteScroll>)
            </div>);

        return (
            (this.state.facilities.length === 0 && this.state.isLoading === false) ? <NoResultItem></NoResultItem> : infiniteFacilities
        );
    }
}

export default FacilitySelector;

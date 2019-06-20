import React from 'react';
import ResultItem from '../result-item/ResultItem';
import NoResultItem from '../result-item/NoResultItem';
import update from 'immutability-helper';
import axios from 'axios';
import queryString from 'query-string';
import InfiniteScroll from 'react-infinite-scroller';
import '../visuals/loading/InfinityScroll.scss';

const CancelToken = axios.CancelToken;

class LocationSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            locations: [],
            tagPageAmount: 50,
            hasMoreLocations: true,
            totalLocations: null,
            isLoading: true
        }
        this.source = CancelToken.source();
        this.loadMoreLocations = this.loadMoreLocations.bind(this);
    }


    componentWillUnmount() {
        this.source.cancel();
    }

    fetchLocationTagCount(projectId, location, index) {
        axios.get(`/projects/${projectId}/tags?locationId=${location.id}&fetch=1`, {
            cancelToken: this.source.token
        })
            .then(payload => {
                this.setState({
                    locations: update(this.state.locations, { [index]: { count: { $set: payload.data.total } } })
                })
            }).catch((e) => {
                if (!axios.isCancel(e)) {
                    console.error('something went wrong when fetching locations in locationsselector.js', e);
                }
            })
    }
    fetchLocationDocCount(projectId, location, index) {
        axios.get(`/projects/${projectId}/documents?references=${location.id}&fetch=1`, {
            cancelToken: this.source.token
        })
            .then(payload => {
                this.setState({
                    locations: update(this.state.locations, { [index]: { count: { $set: payload.data.total } } })
                })
            }).catch((e) => {
                if (!axios.isCancel(e)) {
                    console.error('something went wrong when fetching locations in locationsselector.js', e);
                }
            })
    }

    loadMoreLocations(page) {
        let newLocationIndex = this.state.tagPageAmount * page
        if (this.state.totalLocations && newLocationIndex >= this.state.totalLocations) {
            this.setState({
                hasMoreLocations: false
            })
        }
        this.fetchLocations(this.props.projectId, this.props.urlParams, 0, newLocationIndex);
    }

    fetchLocations(projectId, urlParams, offset, fetch) {
        let url = `/projects/${projectId}/locations`
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
                    totalLocations: payload.data.total,
                    locations: payload.data._embedded.items
                });
                return payload;
            }).then(payload => {
                // eslint-disable-next-line
                payload.data._embedded.items.map((location, i) => {
                    if (this.props.tagCount) {
                        this.fetchLocationTagCount(projectId, location, i);
                    }
                    if (this.props.docCount) {
                        this.fetchLocationDocCount(projectId, location, i);
                    }
                })
            })
            .catch((e) => {
                if (!axios.isCancel(e)) {
                    console.error('something went wrong when fetching locations in locationselector.js', e);
                }
            })
    }

    render() {
        let locationItems =
            this.state.locations.map(location => {
                return <ResultItem key={location.id} content={location.name} count={location.count} contentOnClick={this.props.onLocationSelected.bind(this, location)}></ResultItem>;
            })

        let infiniteLocations = (
            <div className="infinity-scroll-container">
                <InfiniteScroll
                    pageStart={0}
                    loadMore={this.loadMoreLocations}
                    hasMore={this.state.hasMoreLocations}
                    loader={<div className="infinity-scroll-loader">Loading...</div>}
                    useWindow={false}>
                    {locationItems}
                </InfiniteScroll>
            </div>)
        return (
            (this.state.locations.length === 0 && this.state.isLoading === false) ? <NoResultItem></NoResultItem> : infiniteLocations
        );
    }
}

export default LocationSelector;

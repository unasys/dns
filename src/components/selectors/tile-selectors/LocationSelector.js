import React from 'react';
import update from 'immutability-helper';
import axios from 'axios';
import queryString from 'query-string';

const CancelToken = axios.CancelToken;

class LocationSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            locations: [],
            isLoading: true
        }
        this.source = CancelToken.source();
    }


    componentWillUnmount() {
        this.source.cancel();
    }

    componentDidMount() {
        this.fetchLocations(this.props.projectId, this.props.urlParams, 0, 1000); // for now
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
        return (
            this.props.onRender(this.state.locations)
        );
    }
}

export default LocationSelector;

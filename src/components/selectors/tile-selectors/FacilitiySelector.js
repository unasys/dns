import React from 'react';
import queryString from 'query-string';
import update from 'immutability-helper';
import axios from 'axios';

const CancelToken = axios.CancelToken;

class FacilitySelector extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            facilities: [],
            isLoading: true
        }
        this.source = CancelToken.source();
    }

    componentWillUnmount() {
        this.source.cancel();
    }

    componentDidMount() {
        this.fetchFacilities(this.props.projectId, this.props.urlParams, 0, 1000); // for now
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
        return (
            this.props.onRender(this.state.facilities)
        );
    }
}

export default FacilitySelector;

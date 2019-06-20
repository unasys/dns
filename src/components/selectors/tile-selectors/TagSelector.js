import React from 'react';
import axios from 'axios';
import queryString from 'query-string';

const CancelToken = axios.CancelToken;

class TagSelector extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tags: [],
            isLoading: true
        }
        this.source = CancelToken.source();
    }

    componentWillUnmount() {
        this.source.cancel();
    }

    componentDidMount() {
        this.fetchTags(this.props.projectId, this.props.urlParams, 0, 1000); // for now.
    }

    fetchTags(projectId, urlParams, offset, fetch) {
        let url = `/projects/${projectId}/tags`
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
                    tags: payload.data._embedded.items,
                    totalTags: payload.data.total,
                    isLoading: false
                });
            })
            .catch(() => {
                console.log('something went wrong when fetching installations in tagsselector.js');
            })
    }

    render() {
        return (
            this.props.onRender(this.state.tags)
        );
    }
}

export default TagSelector;

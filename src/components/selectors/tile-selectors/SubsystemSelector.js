import React from 'react';
import axios from 'axios';
import queryString from 'query-string';
import update from 'immutability-helper';

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
    }

    componentWillUnmount() {
        this.source.cancel();
    }

    componentDidMount() {
        this.fetchSubsystem(this.props.projectId, this.props.urlParams, 0, 1000) // for now.
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
        return (
            this.props.onRender(this.state.subsystems)
        )
    }
}

export default SubsystemSelector;

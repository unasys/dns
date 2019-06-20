import React from 'react';
import update from 'immutability-helper';
import axios from 'axios';
import queryString from 'query-string';

const CancelToken = axios.CancelToken;

class DisciplineSelector extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            disciplines: [],
            isLoading: true
        }
        this.source = CancelToken.source();
    }

    componentWillUnmount() {
        this.source.cancel();
    }

    componentWillMount() {
        this.fetchDisciplines(this.props.projectId, this.props.urlParams, 0, 1000) // for now
    }
    fetchDisciplineTagCount(projectId, discipline, index) {
        axios.get(`/projects/${projectId}/tags?disciplineId=${discipline.id}&fetch=1`, {
            cancelToken: this.source.token
        })
            .then(payload => {
                this.setState({
                    disciplines: update(this.state.disciplines, { [index]: { count: { $set: payload.data.total } } })
                })
            }).catch((e) => {
                if (!axios.isCancel(e)) {
                    console.error('something went wrong when fetching disciplines in disciplinessselector.js', e);
                }
            })
    }

    fetchDisciplineDocumentCount(projectId, discipline, index) {
        axios.get(`/projects/${projectId}/documents?references=${discipline.id}&fetch=1`, {
            cancelToken: this.source.token
        })
            .then(payload => {
                this.setState({
                    disciplines: update(this.state.disciplines, { [index]: { count: { $set: payload.data.total } } })
                })
            }).catch((e) => {
                if (!axios.isCancel(e)) {
                    console.error('something went wrong when fetching disciplines in disciplinessselector.js', e);
                }
            })
    }

    fetchDisciplines(projectId, urlParams, offset, fetch) {
        let url = `/projects/${projectId}/disciplines`
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
                    disciplines: payload.data._embedded.items,
                    totalDisciplines: payload.data.total
                });
                return payload;
            }).then(payload => {
                // eslint-disable-next-line
                payload.data._embedded.items.map((discipline, i) => {
                    if (this.props.tagCount) {
                        this.fetchDisciplineTagCount(projectId, discipline, i);
                    }
                    if (this.props.docCount) {
                        this.fetchDisciplineDocumentCount(projectId, discipline, i);
                    }
                })
            })
            .catch((e) => {
                if (!axios.isCancel(e)) {
                    console.log('something went wrong when fetching installations in disciplineselector.js');
                }
            })
    }

    render() {
        return (
            this.props.onRender(this.state.disciplines)
        )
    }
}

export default DisciplineSelector;

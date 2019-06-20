import React from 'react';
import NoResultItem from '../result-item/NoResultItem';
import ResultItem from '../result-item/ResultItem';
import update from 'immutability-helper';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroller';
import queryString from 'query-string';

const CancelToken = axios.CancelToken;

class DisciplineSelector extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            disciplines: [],
            disciplinePageAmount: 50,
            hasMoreDisciplines: true,
            totalDisciplines: null,
            isLoading: true
        }
        this.source = CancelToken.source();
        this.loadMoreDisciplines = this.loadMoreDisciplines.bind(this);
    }

    componentWillUnmount() {
        this.source.cancel();
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

    loadMoreDisciplines(page) {
        let newDisciplineIndex = this.state.disciplinePageAmount * page
        if (this.state.totalDisciplines && newDisciplineIndex >= this.state.totalDisciplines) {
            this.setState({
                hasMoreDisciplines: false
            })
        }
        this.fetchDisciplines(this.props.projectId, this.props.urlParams, 0, newDisciplineIndex);
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
        let disciplineItems =
            this.state.disciplines.map(discipline => {
                return <ResultItem key={discipline.id} content={discipline.name} count={discipline.count} contentOnClick={this.props.onDisciplineSelected.bind(this, discipline)}></ResultItem>;
            })

        let infiniteDisciplines = (
            <div className="infinity-scroll-container">
                <InfiniteScroll
                    pageStart={0}
                    loadMore={this.loadMoreDisciplines}
                    hasMore={this.state.hasMoreDisciplines}
                    loader={<div className="infinity-scroll-loader">Loading...</div>}
                    useWindow={false}>
                    {disciplineItems}
                </InfiniteScroll>)
            </div>);

        return (
            (this.state.disciplines.length === 0 && this.state.isLoading === false) ? <NoResultItem></NoResultItem> : infiniteDisciplines
        )
    }
}

export default DisciplineSelector;

import React from 'react';
import ResultItem from '../result-item/ResultItem';
import NoResultItem from '../result-item/NoResultItem';
import axios from 'axios';
import queryString from 'query-string';
import InfiniteScroll from 'react-infinite-scroller';
import '../visuals/loading/InfinityScroll.scss';

const CancelToken = axios.CancelToken;

class TagSelector extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tags: [],
            tagPageAmount: 50,
            hasMoreTags: true,
            totalTags: null,
            isLoading: true
        }
        this.source = CancelToken.source();
        this.loadMoreTags = this.loadMoreTags.bind(this);
    }

    componentWillUnmount() {
        this.source.cancel();
    }

    loadMoreTags(page) {
        let newTagIndex = this.state.tagPageAmount * page
        if (this.state.totalTags && newTagIndex >= this.state.totalTags) {
            this.setState({
                hasMoreTags: false
            })
        }
        this.fetchTags(this.props.projectId, this.props.urlParams, 0, newTagIndex);
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
        let tagItems = (
            this.state.tags.map(tag => {
                let isSelectedTag = false;
                if (this.props.selectedTag !== null && this.props.selectedTag.id === tag.id) {
                    isSelectedTag = true;
                }
                return (<ResultItem
                    key={tag.id}
                    selected={isSelectedTag}
                    content={tag.name}
                    status={tag.status}
                    condition={tag.condition}
                    contentOnClick={this.props.onTagClick.bind(this, tag)}>
                </ResultItem>);
            })
        )
        let infiniteTags = (
            <div className="infinity-scroll-container">
                <InfiniteScroll
                    pageStart={0}
                    loadMore={this.loadMoreTags}
                    hasMore={this.state.hasMoreTags}
                    loader={<div className="infinity-scroll-loader">Loading...</div>}
                    useWindow={false}>
                    {tagItems}
                </InfiniteScroll>
            </div>)
        return (this.state.tags.length === 0 && this.state.isLoading === false) ? <NoResultItem></NoResultItem> : infiniteTags
    }
}

export default TagSelector;

import React from 'react';
import ResultItem from '../result-item/ResultItem';
import queryString from 'query-string';
import NoResultItem from '../result-item/NoResultItem';
import FileSaver from 'file-saver';
import InfiniteScroll from 'react-infinite-scroller';
import axios from 'axios';
import { getContentForDocument } from '../../api/Documents';

const CancelToken = axios.CancelToken;

class DocumentsSelector extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            documents: [],
            documentPageAmount: 50,
            hasMoreDocuments: true,
            totalDocuments: null,
            isLoading: true
        }
        this.source = CancelToken.source();
        this.downloadOnClick = this.downloadOnClick.bind(this);
        this.loadMoreDocuments = this.loadMoreDocuments.bind(this);
    }

    componentWillUnmount() {
        this.source.cancel();
    }

    loadMoreDocuments(page) {
        let newDocumentIndex = this.state.documentPageAmount * page
        if (this.state.totalDocuments && newDocumentIndex >= this.state.totalDocuments) {
            this.setState({
                hasMoreDocuments: false
            })
        }
        this.fetchDocuments(this.props.projectId, this.props.urlParams, 0, newDocumentIndex);
    }

    fetchDocuments(projectId, urlParams, offset, fetch) {
        let url = `/projects/${projectId}/documents`

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
                    documents: payload.data._embedded.items,
                    isLoading: false,
                    totalDocuments: payload.data.total
                });
            })
            .catch((e) => {
                if (!axios.isCancel(e)) {
                    console.log('something went wrong when fetching installations in documentsselector.js');
                }
            })
    }

    onDocumentClick(document) {
        this.props.onDocumentClick(document)
        this.props.onEntityClick(document.id);
    }

    downloadOnClick(document) {
        if (document.currentRevision.fileType) {
            getContentForDocument(document.currentRevision.content).then(res => {
                FileSaver.saveAs(res.data, document.name);
            })
        }
    }

    render() {
        let documentItems =
            this.state.documents.map(document => {
                let isSelectedDocument = false;
                if (this.props.selectedDocument !== null && this.props.selectedDocument.id === document.id) {
                    isSelectedDocument = true;
                }

                let content = <div className="document-result-item">
                    <div>{document.detail}</div>
                    <div>{document.name}</div>
                </div>
                let largeResultItem = document.detail && document.detail.length !== 0 && document.name && document.name.length !== 0
                return (<ResultItem
                    key={document.id}
                    largeResultItem={largeResultItem}
                    content={content}
                    isExternalLink={true} externalLinkSrc={document.currentRevision.content}
                    isDownload={true}
                    downloadOnClick={() => this.downloadOnClick(document)}
                    selected={isSelectedDocument}
                    contentOnClick={() => this.onDocumentClick(document)}>
                </ResultItem>);
            })

        let infiniteDocuments =
            <div className="infinity-scroll-container">
                <InfiniteScroll
                    pageStart={0}
                    loadMore={this.loadMoreDocuments}
                    hasMore={this.state.hasMoreDocuments}
                    loader={<div className="infinity-scroll-loader">Loading...</div>}
                    useWindow={false}>
                    {documentItems}
                </InfiniteScroll>)
            </div>;

        return (
            (this.state.documents.length === 0 && this.state.isLoading === false) ? <NoResultItem></NoResultItem> : infiniteDocuments)
    }
}

export default DocumentsSelector;

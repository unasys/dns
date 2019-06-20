import React from 'react';
import queryString from 'query-string';
import FileSaver from 'file-saver';
import axios from 'axios';
import { getContentForDocument } from '../../../api/Documents';

const CancelToken = axios.CancelToken;

class DocumentsSelector extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            documents: [],
            totalDocuments: null,
            isLoading: true
        }
        this.source = CancelToken.source();
        this.downloadOnClick = this.downloadOnClick.bind(this);
    }

    componentDidMount() {
        this.fetchDocuments(this.props.projectId, this.props.urlParams, 0, 1000); // for now
    }

    componentWillUnmount() {
        this.source.cancel();
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
        return (
            this.props.onRender(this.state.documents)
        )
    }
}

export default DocumentsSelector;

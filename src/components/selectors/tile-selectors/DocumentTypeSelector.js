import React from 'react';
import update from 'immutability-helper';
import axios from 'axios';
import queryString from 'query-string';

const CancelToken = axios.CancelToken;

class DocumentTypeSelector extends React.Component {

    constructor(props) {
        super(props);
        this.source = CancelToken.source();
        this.state = {
            documentTypes: [],
            isLoading: true
        }
    }

    fetchDocumentTypeDocumentCount(projectId, urlParams, index) {
        let url = `/projects/${projectId}/documents`;

        let urlParamsStr = queryString.stringify(urlParams);
        if (urlParamsStr.length !== 0) {
            url += `?${urlParamsStr}&fetch=1`;
        } else {
            url += `?fetch=1`
        }

        axios.get(url, {
            cancelToken: this.source.token
        })
            .then(payload => {
                this.setState({
                    documentTypes: update(this.state.documentTypes, { [index]: { count: { $set: payload.data.total } } })
                })
            }).catch((e) => {
                if (!axios.isCancel(e)) {
                    console.error('something went wrong when fetching documentTypes in documentTypesSelector.js', e);
                }
            })
    }

    fetchDocumentTypes(projectId) {
        axios.get(`/projects/${projectId}/document-types`, {
            cancelToken: this.source.token
        })
            .then(payload => {
                this.setState({
                    documentTypes: payload.data._embedded.items,
                    isLoading: false
                });
                return payload;
            }).then(payload => {
                // eslint-disable-next-line
                payload.data._embedded.items.map((documentType, i) => {
                    let urlParams;
                    if (this.props.references) {
                        urlParams = { references: this.props.references, documentTypeId: documentType.id }
                    } else {
                        urlParams = { documentTypeId: documentType.id }
                    }
                    this.fetchDocumentTypeDocumentCount(projectId, urlParams, i);
                })
            })
            .catch((e) => {
                if (!axios.isCancel(e)) {
                    console.error('something went wrong when fetching facilities in facilitiesselector.js', e);
                }
            })
    }

    componentDidMount() {
        this.fetchDocumentTypes(this.props.projectId);
    }

    componentWillUnmount() {
        this.source.cancel();
    }

    render() {
        return (
            this.props.onRender(this.state.documentTypes)
        )
    }
}

export default DocumentTypeSelector;

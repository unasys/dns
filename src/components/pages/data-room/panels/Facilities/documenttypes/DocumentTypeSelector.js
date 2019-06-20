import React from 'react';
import ResultItem from '../../../../../result-item/ResultItem'
import update from 'immutability-helper';
import axios from 'axios';
import NoResultItem from '../../../../../result-item/NoResultItem';

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

    fetchDocumentTypeDocumentCount(projectId, documentType, index, facility) {
        axios.get(`/projects/${projectId}/documents?references=${facility.id}&documentTypeId=${documentType.id}&fetch=1`, {
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

                    this.fetchDocumentTypeDocumentCount(projectId, documentType, i, this.props.facility);
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
            (this.state.documentTypes.length === 0 && this.state.isLoading === false) ? <NoResultItem></NoResultItem> :
                this.state.documentTypes.map(documentType => {
                    return <ResultItem key={documentType.id} content={documentType.name} count={documentType.count} contentOnClick={this.props.onDocumentTypeSelected.bind(this, documentType)}></ResultItem>;
                })
        );
    }
}

export default DocumentTypeSelector;

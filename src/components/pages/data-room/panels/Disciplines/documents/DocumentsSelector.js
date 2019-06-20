import React from 'react';
import ResultItem from '../../../../../result-item/ResultItem';
import NoResultItem from '../../../../../result-item/NoResultItem';
import axios from 'axios';

const CancelToken = axios.CancelToken;

class DocumentsSelector extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            documents: [],
            isLoading: true
        }
        this.source = CancelToken.source();
    }

    fetchDocuments(projectId, discipline) {
        axios.get(`/projects/${projectId}/documents?references=${discipline.id}`, {
            cancelToken: this.source.token
        })
            .then(payload => {
                this.setState({
                    documents: payload.data._embedded.items,
                    isLoading: false
                });
            })
            .catch((e) => {
                if (!axios.isCancel(e)) {
                    console.log('something went wrong when fetching installations in documentsselector.js');
                }
            })
    }

    componentDidMount() {
        this.fetchDocuments(this.props.projectId, this.props.discipline);
    }

    componentWillUnmount() {
        this.source.cancel();
    }

    onDocumentClick(document) {
        this.props.onDocumentClick(document)
        this.props.onEntityClick(document.id);
    }

    render() {
        return (
            (this.state.documents.length === 0 && this.state.isLoading === false) ? <NoResultItem></NoResultItem> :
                this.state.documents.map(document => {
                    let isSelectedDocument = false;
                    if (this.props.selectedDocument !== null && this.props.selectedDocument.id === document.id) {
                        isSelectedDocument = true;
                    }
                    return (<ResultItem
                        key={document.id}
                        content={document.name}
                        selected={isSelectedDocument}
                        contentOnClick={() => this.onDocumentClick(document)}>
                    </ResultItem>);
                })
        );
    }
}

export default DocumentsSelector;

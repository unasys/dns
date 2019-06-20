import React, { Component } from 'react';
import axios from 'axios';
import DotSpinner from '../../../../visuals/loading/DotSpinner';
import { fetchDocumentTypes } from '../../../../../api/DocumentTypes';

const CancelToken = axios.CancelToken;

class DocumentTypeSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            documentTypes: [],
            isLoading: true,
            searchPhrase: ''
        }
        this.source = CancelToken.source();
    }

    componentDidMount() {
        this.fetchDocumentTypes(this.props.projectId);
    }

    componentWillUnmount() {
        this.source.cancel()
    }

    fetchDocumentTypes(projectId) {
        fetchDocumentTypes(projectId, this.source.token)
            .then(payload => {
                this.setState({
                    documentTypes: payload.data._embedded.items,
                    isLoading: false
                });
                return payload;
            })
            .catch((e) => {
                if (!axios.isCancel(e)) {
                    console.error('something went wrong when fetching documentTypes in documenttypeselector.js', e);
                }
            })
    }

    updateSearchPhrase(evt) {
        this.setState({
            searchPhrase: evt.target.value
        })
    }

    filterDocumentTypes(documenttypes, searchPhrase) {
        let searchPhraseUpper = searchPhrase.toUpperCase();
        return documenttypes.filter(documentType => {
            return documentType.name.toUpperCase().includes(searchPhraseUpper)
        })
    }

    render() {
        let searchBar = (
            <div className="search-bar-container">
                <div className="field">
                    <div className="control">
                        <input value={this.state.searchPhrase} onChange={evt => this.updateSearchPhrase(evt)} className="input" type="text" placeholder="Search" />
                    </div>
                </div>
            </div>)

        let filteredDocumentTypes;
        if (this.state.searchPhrase !== null && this.state.searchPhrase !== '') {
            filteredDocumentTypes = this.filterDocumentTypes(this.state.documentTypes, this.state.searchPhrase);
        } else {
            filteredDocumentTypes = this.state.documentTypes;
        }

        let documentTypes = (
            filteredDocumentTypes.map(documentType => {
                return (
                    <ul className="menu-list" key={documentType.name}>
                        <li className={this.props.selectedDocumentType === documentType ? 'selected' : ''}
                            onClick={this.props.onDocumentTypeSelect.bind(this, documentType)}> {/** extract to subcomponent */}
                            <a href='# '>{documentType.name}
                                {this.props.selectedDocument === documentType && <i className="fas fa-times close-button" onClick={(e) => {
                                    e.stopPropagation();
                                    this.props.clearDocumentTypeSelected();
                                }
                                }>
                                </i>}
                            </a>
                        </li>
                    </ul>)
            }))

        return (
            <div>
                {searchBar}
                {this.state.isLoading ? <DotSpinner size={49}></DotSpinner> :
                    (filteredDocumentTypes.length === 0) ? <div>No results.</div> :
                        <div className="production-unit-type-list-container">
                            {documentTypes}
                        </div>}
            </div>);
    }
}

export default DocumentTypeSelector;
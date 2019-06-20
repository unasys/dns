import React, { Component } from "react";
import './styles/AddDocument.scss';
import axios from 'axios';
import Updated from "../../../visuals/user-feedback/Updated";
import { updateDocumentsType } from "../../../../api/Documents";
import DocumentTypeSelector from "../panels/selectors/DocumentTypeSelector";

const CancelToken = axios.CancelToken;

class UpdateDocumentsType extends Component {

    constructor(props) {
        super(props);
        this.source = CancelToken.source();
        this.state = {
            updated: false,
            selectedDocumentType: null,
            documentTypeError: ''
        }
        this.clientSideValidation = this.clientSideValidation.bind(this);
        this.updateDocumentsType = this.updateDocumentsType.bind(this);
        this.documentTypeSelected = this.documentTypeSelected.bind(this);
        this.clearDocumentTypeSelected = this.clearDocumentTypeSelected.bind(this);
    }

    componentWillUnmount() {
        this.source.cancel()
    }

    // on form change - reset error text. 
    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value, [`${e.target.name}Error`]: '' })
    }

    clientSideValidation() {
        let passed = true;
        if (this.state.selectedDocumentType === null) {
            this.setState({
                documentTypeError: 'Production Unit Type is required!'
            })
            passed = false;
        }
        return passed;
    }

    documentTypeSelected(puType) {
        this.setState({
            selectedDocumentType: puType,
            documentTypeError: ''
        })
    }

    clearDocumentTypeSelected() {
        this.setState({
            selectedDocumentType: null,
            documentTypeError: ''
        })
    }

    resetUpdatedState() {
        this.setState({
            updated: false
        })
    }

    updateDocumentsType(e) {
        e.preventDefault();
        e.target.className += ' was-validated';

        if (!this.clientSideValidation()) {
            return;
        }

        let body = {
            documentTypeId: this.state.selectedDocumentType.id
        }

        updateDocumentsType(this.props.projectId, this.props.document.id, body, this.source.token)
            .then(payload => {
                // Server side validation.
                if (payload.status === 201) {
                    // success 
                    this.setState({
                        updated: true
                    })
                } else {
                    //error
                    switch (payload.data.Case) {
                        case '':
                            this.setState({
                                documentTypeError: 'The Document already has that Type!'
                            })
                            break;
                        default:
                            return; // currently silently erroring
                    }
                }
            })
    }

    render() {
        let content;
        if (this.state.updated) {
            content = <Updated entityName="Document's Type"></Updated>
            new Promise(resolve => setTimeout(resolve, 1500)).then(res => {
                this.resetUpdatedState();
                this.props.close();
            });
        } else {
            content = (
                <div className="add-document-container">
                    <h1 className="title">
                        Update Document - Type
                    </h1>
                    <form onSubmit={this.updateDocumentsType}>
                        <p className="menu-label">Current Document Type - <span>{this.props.document.documentTypeName && this.props.document.documentTypeName.length !== 0 ? this.props.document.documentTypeName : 'None'}</span></p>
                        <div className={(this.state.documentTypeError.length > 0 ? ' is-danger' : '')}>
                            <DocumentTypeSelector
                                projectId={this.props.projectId}
                                onDocumentTypeSelect={this.documentTypeSelected}
                                selectedDocumentType={this.state.selectedDocumentType}
                                clearDocumentTypeSelected={this.clearDocumentTypeSelected}>
                            </DocumentTypeSelector>
                        </div>
                        <p className="help is-danger">
                            {this.state.documentTypeError}
                        </p>
                        <br />
                        {this.state.selectedDocumentType !== null && <p className="menu-label">New Document Type - {this.state.selectedDocumentType.name}</p>}
                        <button type="submit" className="button is-link">Submit</button>
                    </form>
                </div>
            )
        }
        return (
            <div className="add-document-container border rounded">
                <div className="close-button-container"><i className="fas fa-times close-button" onClick={this.props.close}></i></div>
                {content}
            </div>
        )
    }
}

export default UpdateDocumentsType;
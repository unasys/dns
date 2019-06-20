import React, { Component } from "react";
import './styles/Documents.scss';
import DocumentsTable from "./DocumentsTable";
import ActionPanel from "./ActionPanel";

class Documents extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedDocument: null
        }
        this.selectDocument = this.selectDocument.bind(this);
    }

    selectDocument(document) {
        this.setState({
            selectedDocument: document
        })
    }
    render() {
        return (
            <div className="documents-grid-container">
                <div className="main-content">
                    <DocumentsTable projectId={this.props.projectId} selectDocument={this.selectDocument}></DocumentsTable>
                </div>
                <div className="right-sidebar">
                    <ActionPanel entity="Document" projectId={this.props.projectId} selectedDocument={this.state.selectedDocument}></ActionPanel>
                </div>
            </div>
        )
    }
}

export default Documents;
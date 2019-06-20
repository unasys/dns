import React, { Component } from "react";
import DocumentTypesTable from "./DocumentTypesTable";
import './styles/DocumentTypes.scss';
import ActionPanel from "./ActionPanel";

class DocumentTypes extends Component {
    render() {
        return (
            <div className="production-unit-types-grid-container">
                <div className="main-content">
                    <DocumentTypesTable projectId={this.props.projectId}></DocumentTypesTable>
                </div>
                <div className="right-sidebar">
                    <ActionPanel entity="Document Type" projectId={this.props.projectId}></ActionPanel>
                </div>
            </div>
        )
    }
}

export default DocumentTypes;
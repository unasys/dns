import React from 'react';
import DocumentTypeSelector from './DocumentTypeSelector';
import SystemsPanel from './P&IDs/systems/SystemPanel';
import ModulesPanel from './StructuralDrawings/ModulesPanel';
import DocumentsPanel from '../documents/DocumentsPanel';

class DocumentTypesPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            documentTypeSelected: null,
            breadcrumbName: '',
            breadcrumbTitle: 'Document Type'
        }

        this.onDocumentTypeSelected = this.onDocumentTypeSelected.bind(this);
        this.clearDocumentTypeSelected = this.clearDocumentTypeSelected.bind(this);

        this.props.addToBreadcrumbs({ name: this.state.breadcrumbName, title: this.state.breadcrumbTitle, onClick: this.clearDocumentTypeSelected });
    }

    onDocumentTypeSelected(documentType) {
        let newBreadcrumbName = `${documentType.name}`;
        this.props.updateBreadcrumbName(this.state.breadcrumbName, newBreadcrumbName);
        this.setState({
            documentTypeSelected: documentType,
            breadcrumbName: newBreadcrumbName
        })
        this.props.onEntityClick(documentType.id);
    }

    clearDocumentTypeSelected() {
        this.setState({
            documentTypeSelected: null,
            breadcrumbName: ''
        })
    }

    getPathFromDocType(docType) {
        switch (docType.name) {
            case "P&ID's":
                return <SystemsPanel
                    facility={this.props.facility}
                    makeWideWidth={this.props.makeWideWidth}
                    documentType={this.state.documentTypeSelected}
                    projectId={this.props.projectId}
                    selectedDocument={this.props.selectedDocument}
                    addToBreadcrumbs={this.props.addToBreadcrumbs}
                    updateBreadcrumbName={this.props.updateBreadcrumbName}
                    onDocumentClick={this.props.onDocumentClick}
                    onEntityClick={this.props.onEntityClick}>
                </SystemsPanel>
            case "Structural Drawings":
                return <ModulesPanel
                    facility={this.props.facility}
                    documentType={this.state.documentTypeSelected}
                    projectId={this.props.projectId}
                    selectedDocument={this.props.selectedDocument}
                    addToBreadcrumbs={this.props.addToBreadcrumbs}
                    updateBreadcrumbName={this.props.updateBreadcrumbName}
                    onDocumentClick={this.props.onDocumentClick}
                    onEntityClick={this.props.onEntityClick}>
                </ModulesPanel>
            default:
                return <DocumentsPanel
                    facility={this.props.facility}
                    documentType={this.state.documentTypeSelected}
                    projectId={this.props.projectId}
                    selectedDocument={this.props.selectedDocument}
                    addToBreadcrumbs={this.props.addToBreadcrumbs}
                    updateBreadcrumbName={this.props.updateBreadcrumbName}
                    onDocumentClick={this.props.onDocumentClick}
                    onEntityClick={this.props.onEntityClick}>
                </DocumentsPanel>
        }
    }

    render() {
        return (this.state.documentTypeSelected === null ?
            <DocumentTypeSelector
                facility={this.props.facility}
                onDocumentTypeSelected={this.onDocumentTypeSelected}
                projectId={this.props.projectId}>
            </DocumentTypeSelector>
            :
            this.getPathFromDocType(this.state.documentTypeSelected)
        )
    }
}

export default DocumentTypesPanel;

import React from 'react';
import DocumentsSelector from './DocumentsSelector';

class DocumentsPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            breadcrumbName: 'Documents'
        }

        this.props.addToBreadcrumbs({ name: this.state.breadcrumbName, onClick: () => 0 });
    }

    render() {
        return (
            <DocumentsSelector
                discipline={this.props.discipline}
                projectId={this.props.projectId}
                addToBreadcrumbs={this.props.addToBreadcrumbs}
                selectedDocument={this.props.selectedDocument}
                onDocumentClick={this.props.onDocumentClick}
                onEntityClick={this.props.onEntityClick}>
            </DocumentsSelector>)
    }
}

export default DocumentsPanel;

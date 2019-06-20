import React from 'react';
import DocumentsSelector from '../../../../../selectors/DocumentSelector';

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
                urlParams={this.props.urlParams}
                projectId={this.props.projectId}
                addToBreadcrumbs={this.props.addToBreadcrumbs}
                selectedDocument={this.props.selectedDocument}
                onDocumentClick={this.props.onDocumentClick}
                onEntityClick={this.props.onEntityClick}>
            </DocumentsSelector>)
    }
}

export default DocumentsPanel;

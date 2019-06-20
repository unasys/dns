import React from 'react';
import SystemSelector from '../../../../../../../selectors/SystemSelector';
import DocumentsPanel from '../../../documents/DocumentsPanel.js';
import { onRender } from '../../../../../../../selectors/renderers/list-renderers/SystemListRenderer';

class SystemPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            systemSelected: null,
            breadcrumbName: '',
            breadcrumbTitle: 'System'
        }

        this.onSystemSelected = this.onSystemSelected.bind(this);
        this.clearSystemSelected = this.clearSystemSelected.bind(this);

        this.props.addToBreadcrumbs({ name: this.state.breadcrumbName, title: this.state.breadcrumbTitle, onClick: this.clearSystemSelected });
    }

    componentDidMount() {
        this.props.makeWideWidth()
    }

    onSystemSelected(system) {
        let newBreadcrumbName = `${system.name}`;
        this.props.updateBreadcrumbName(this.state.breadcrumbName, newBreadcrumbName);
        this.setState({
            systemSelected: system,
            breadcrumbName: newBreadcrumbName
        })
        this.props.onEntityClick(system.id);
    }

    clearSystemSelected() {
        this.setState({
            systemSelected: null,
            breadcrumbName: ''
        })
    }

    render() {
        return (this.state.systemSelected === null ?
            <SystemSelector
                docCount={true}
                onSystemSelected={this.onSystemSelected}
                projectId={this.props.projectId}
                onRender={onRender}>
            </SystemSelector>
            :
            <DocumentsPanel
                urlParams={{ references: [this.state.systemSelected.id, this.props.documentType.id] }}
                projectId={this.props.projectId}
                addToBreadcrumbs={this.props.addToBreadcrumbs}
                updateBreadcrumbName={this.props.updateBreadcrumbName}
                onDocumentClick={this.props.onDocumentClick}
                selectedDocument={this.props.selectedDocument}
                onEntityClick={this.props.onEntityClick}>
            </DocumentsPanel>
        )
    }
}

export default SystemPanel;
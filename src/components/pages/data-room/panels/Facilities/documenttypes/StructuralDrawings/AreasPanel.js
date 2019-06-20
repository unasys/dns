import React from 'react';
import DocumentsPanel from '../../documents/DocumentsPanel';
import AreaSelector from '../../../../../../selectors/AreaSelector';

class AreaPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            areaSelected: null,
            breadcrumbName: '',
            breadcrumbTitle: 'Area'
        }

        this.onAreaSelected = this.onAreaSelected.bind(this);
        this.clearAreaSelected = this.clearAreaSelected.bind(this);

        this.props.addToBreadcrumbs({ name: this.state.breadcrumbName, title: this.state.breadcrumbTitle, onClick: this.clearAreaSelected });
    }

    onAreaSelected(area) {
        let newBreadcrumbName = `${area.name}`;
        this.props.updateBreadcrumbName(this.state.breadcrumbName, newBreadcrumbName);
        this.setState({
            areaSelected: area,
            breadcrumbName: newBreadcrumbName
        });
        this.props.onEntityClick(area.id);
    }

    clearAreaSelected() {
        this.setState({
            areaSelected: null,
            breadcrumbName: ''
        })
    }

    render() {
        return (this.state.areaSelected === null ?
            <AreaSelector
                docCount={true}
                onAreaSelected={this.onAreaSelected}
                urlParams={{ moduleId: this.props.module.id }}
                projectId={this.props.projectId}
                addToBreadcrumbs={this.props.addToBreadcrumbs}>
            </AreaSelector>
            :
            <DocumentsPanel
                urlParams={{ references: this.state.areaSelected.id }}
                projectId={this.props.projectId}
                selectedDocument={this.props.selectedDocument}
                addToBreadcrumbs={this.props.addToBreadcrumbs}
                updateBreadcrumbName={this.props.updateBreadcrumbName}
                onDocumentClick={this.props.onDocumentClick}
                onEntityClick={this.props.onEntityClick}>
            </DocumentsPanel>
        )
    }
}

export default AreaPanel;

import React from 'react';
import DocumentsPanel from './documents/DocumentsPanel';
import AreaSelector from '../../../../selectors/AreaSelector';

// this code is dead for now, was left in as eventually the data room will have a disciplines section. and this component might be needed then..

class AreaPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            areaSelected: null,
            breadcrumbName: 'Area'
        }

        this.onAreaSelected = this.onAreaSelected.bind(this);
        this.clearAreaSelected = this.clearAreaSelected.bind(this);

        this.props.addToBreadcrumbs({ name: this.state.breadcrumbName, onClick: this.clearAreaSelected });
    }

    onAreaSelected(area) {
        let newBreadcrumbName = `Area(${area.name})`;
        this.props.updateBreadcrumbName(this.state.breadcrumbName, newBreadcrumbName);
        this.setState({
            areaSelected: area,
            breadcrumbName: newBreadcrumbName
        });
        this.props.onEntityClick(area.id);
    }

    clearAreaSelected() {
        this.setState({
            areaSelected: null
        })
    }

    render() {
        return (this.state.areaSelected === null ?
            <AreaSelector
                docCount={true}
                onAreaSelected={this.onAreaSelected}
                projectId={this.props.projectId}
                addToBreadcrumbs={this.props.addToBreadcrumbs}>
            </AreaSelector>
            :
            <DocumentsPanel
                area={this.state.areaSelected}
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

import React from 'react';
import LocationSelector from '../../../../../../selectors/LocationSelector';
import DocumentsPanel from '../../documents/DocumentsPanel';

class LocationsPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            locationSelected: null,
            breadcrumbName: '',
            breadcrumbTitle: 'Location'
        }

        this.onLocationSelected = this.onLocationSelected.bind(this);
        this.clearLocationSelected = this.clearLocationSelected.bind(this);

        this.props.addToBreadcrumbs({ name: this.state.breadcrumbName, title: this.state.breadcrumbTitle, onClick: this.clearLocationSelected });
    }

    onLocationSelected(location) {
        let newBreadcrumbName = `${location.name}`;
        this.props.updateBreadcrumbName(this.state.breadcrumbName, newBreadcrumbName);
        this.setState({
            locationSelected: location,
            breadcrumbName: newBreadcrumbName
        })
        this.props.onEntityClick(location.id);
    }

    clearLocationSelected() {
        this.setState({
            locationSelected: null,
            breadcrumbName: ''
        })
    }

    render() {
        return (this.state.locationSelected === null ?
            <LocationSelector
                urlParams={
                    {
                        facilityId: this.props.facility.id,
                        moduleId: this.props.module.id,
                        areaId: this.props.area.id
                    }
                }
                docCount={true}
                onLocationSelected={this.onLocationSelected}
                projectId={this.props.projectId}
                addToBreadcrumbs={this.props.addToBreadcrumbs}>
            </LocationSelector>
            :
            <DocumentsPanel
                urlParams={
                    {
                        facilityId: this.props.facility.id,
                        references: this.state.locationSelected.id
                    }
                }
                documentType={this.state.documentTypeSelected}
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

export default LocationsPanel;

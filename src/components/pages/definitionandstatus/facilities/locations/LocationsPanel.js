import React from 'react';
import LocationSelector from '../../../../selectors/LocationSelector';
import EquipmentPanel from '../equipment/EquipmentPanel';

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
                        // module id should be here really...
                        areaId: this.props.area.id
                    }
                }
                tagCount={true}
                onLocationSelected={this.onLocationSelected}
                projectId={this.props.projectId}
                addToBreadcrumbs={this.props.addToBreadcrumbs}>
            </LocationSelector>
            :
            <EquipmentPanel
                facility={this.props.facility}
                module={this.state.module}
                location={this.state.locationSelected}
                projectId={this.props.projectId}
                addToBreadcrumbs={this.props.addToBreadcrumbs}
                updateBreadcrumbName={this.props.updateBreadcrumbName}
                onTagClick={this.props.onTagClick}
                selectedTag={this.props.selectedTag}
                onEntityClick={this.props.onEntityClick}>
            </EquipmentPanel>
        )
    }
}

export default LocationsPanel;

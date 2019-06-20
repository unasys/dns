import React from 'react';
import FacilitySelector from '../../../selectors/FacilitySelector';
import ModulesPanel from './modules/ModulesPanel';

class FacilitiesPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            facilitySelected: null,
            breadcrumbName: '',
            breadcrumbTitle: 'Facility'
        }

        this.onFacilitySelected = this.onFacilitySelected.bind(this);
        this.clearFacilitySelected = this.clearFacilitySelected.bind(this);

        this.props.addToBreadcrumbs({ name: this.state.breadcrumbName, title: this.state.breadcrumbTitle, onClick: this.clearFacilitySelected });
    }

    onFacilitySelected(facility) {
        let newBreadcrumbName = `${facility.name}`;
        this.props.updateBreadcrumbName(this.state.breadcrumbName, newBreadcrumbName);
        this.setState({
            facilitySelected: facility,
            breadcrumbName: newBreadcrumbName
        })
        this.props.onEntityClick(facility.id);
    }

    clearFacilitySelected() {
        this.setState({
            facilitySelected: null,
            breadcrumbName: ''
        })
    }

    render() {
        return (this.state.facilitySelected === null ?
            <FacilitySelector
                tagCount={true}
                onFacilitySelected={this.onFacilitySelected}
                projectId={this.props.projectId}>
            </FacilitySelector>
            :
            <ModulesPanel
                facility={this.state.facilitySelected}
                projectId={this.props.projectId}
                addToBreadcrumbs={this.props.addToBreadcrumbs}
                updateBreadcrumbName={this.props.updateBreadcrumbName}
                onTagClick={this.props.onTagClick}
                selectedTag={this.props.selectedTag}
                onEntityClick={this.props.onEntityClick}>
            </ModulesPanel>
        )
    }
}

export default FacilitiesPanel;

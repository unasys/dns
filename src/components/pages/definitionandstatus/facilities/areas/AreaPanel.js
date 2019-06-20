import React from 'react';
import LocationPanel from '../locations/LocationsPanel';
import AreaSelector from '../../../../selectors/AreaSelector';

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
                tagCount={true}
                onAreaSelected={this.onAreaSelected}
                urlParams={{ moduleId: this.props.module.id, facilityId: this.props.facility.id }}
                projectId={this.props.projectId}
                addToBreadcrumbs={this.props.addToBreadcrumbs}>
            </AreaSelector>
            :
            <LocationPanel
                facility={this.props.facility}
                module={this.props.module}
                area={this.state.areaSelected}
                projectId={this.props.projectId}
                addToBreadcrumbs={this.props.addToBreadcrumbs}
                updateBreadcrumbName={this.props.updateBreadcrumbName}
                onTagClick={this.props.onTagClick}
                selectedTag={this.props.selectedTag}
                onEntityClick={this.props.onEntityClick}>
            </LocationPanel>
        )
    }
}

export default AreaPanel;

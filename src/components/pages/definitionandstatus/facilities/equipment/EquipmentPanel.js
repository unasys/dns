import React from 'react';
import EquipmentSelector from '../../../../selectors/EquipmentTypeSelector';
import TagPanel from '../tags/TagPanel';

class EquipmentPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            equipmentSelected: null,
            breadcrumbName: '',
            breadcrumbTitle: 'Equipment'
        }

        this.onEquipmentSelected = this.onEquipmentSelected.bind(this);
        this.clearEquipmentSelected = this.clearEquipmentSelected.bind(this);

        this.props.addToBreadcrumbs({ name: this.state.breadcrumbName, title: this.state.breadcrumbTitle, onClick: this.clearEquipmentSelected });
    }

    onEquipmentSelected(equipment) {
        let newBreadcrumbName = `${equipment.name}`;
        this.props.updateBreadcrumbName(this.state.breadcrumbName, newBreadcrumbName);
        this.setState({
            equipmentSelected: equipment,
            breadcrumbName: newBreadcrumbName
        })
        this.props.onEntityClick(equipment.id);
    }

    clearEquipmentSelected() {
        this.setState({
            equipmentSelected: null,
            breadcrumbName: ''
        })
    }

    render() {
        return (this.state.equipmentSelected === null ?
            <EquipmentSelector
                tagCount={true}
                tagCountUrlParams={{ locationId: this.props.location.id }}
                urlParams={{ locationId: this.props.location.id }}
                onEquipmentTypeSelected={this.onEquipmentSelected}
                projectId={this.props.projectId}>
            </EquipmentSelector>
            :
            <TagPanel
                location={this.props.location}
                equipmentType={this.state.equipmentSelected}
                projectId={this.props.projectId}
                addToBreadcrumbs={this.props.addToBreadcrumbs}
                onTagClick={this.props.onTagClick}
                selectedTag={this.props.selectedTag}
                onEntityClick={this.props.onEntityClick}>
            </TagPanel>
        )
    }
}

export default EquipmentPanel;

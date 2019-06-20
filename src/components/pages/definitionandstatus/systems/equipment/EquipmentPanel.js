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
                tagCountUrlParams={{ subsystemId: this.props.subsystem.id }}
                urlParams={{ subsystemId: this.props.subsystem.id }}
                onEquipmentTypeSelected={this.onEquipmentSelected}
                projectId={this.props.projectId}>
            </EquipmentSelector>
            :
            <TagPanel
                subsystem={this.props.subsystem}
                equipmentType={this.state.equipmentSelected}
                projectId={this.props.projectId}
                addToBreadcrumbs={this.props.addToBreadcrumbs}
                onTagClick={this.props.onTagClick}
                selectedTag={this.props.selectedTag}>
            </TagPanel>
        )
    }
}

export default EquipmentPanel;

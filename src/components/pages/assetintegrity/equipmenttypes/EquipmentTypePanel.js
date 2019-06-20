import React from 'react';
import EquipmentTypeSelector from '../../../selectors/EquipmentTypeSelector';
import TagSelector from './TagSelector';

class EquipmentTypePanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            equipmentTypeSelected: null,
            breadcrumbName: '',
            breadcrumbTitle: 'Equipment'
        }

        this.onEquipmentTypeSelected = this.onEquipmentTypeSelected.bind(this);
        this.clearEquipmentTypeSelected = this.clearEquipmentTypeSelected.bind(this);
        this.props.addToBreadcrumbs({ name: this.state.breadcrumbName, title: this.state.breadcrumbTitle, onClick: this.clearEquipmentTypeSelected });
    }

    onEquipmentTypeSelected(equipmentType) {
        let newBreadcrumbName = `${equipmentType.name}`;
        this.props.updateBreadcrumbName(this.state.breadcrumbName, newBreadcrumbName);
        this.setState({
            equipmentTypeSelected: equipmentType,
            breadcrumbName: newBreadcrumbName
        })
    }

    clearEquipmentTypeSelected() {
        this.setState({
            equipmentTypeSelected: null,
            breadcrumbName: ''
        })
    }

    render() {
        return (this.state.equipmentTypeSelected === null ?
            <EquipmentTypeSelector
                projectId={this.props.projectId}
                urlParams={{ criticality: this.props.critical.toLowerCase() }}
                onEquipmentTypeSelected={this.onEquipmentTypeSelected}>
            </EquipmentTypeSelector>
            :
            <TagSelector
                projectId={this.props.projectId}
                critical={this.props.critical}
                equipmentType={this.state.equipmentTypeSelected}
                addToBreadcrumbs={this.props.addToBreadcrumbs}
                onTagClick={this.props.onTagClick}>
            </TagSelector>)
    }
}

export default EquipmentTypePanel;

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
            breadcrumbTitle: ''
        })
    }

    render() {
        return (this.state.equipmentSelected === null ?
            <EquipmentSelector
                tagCount={true}
                tagCountUrlParams={{ disciplineId: this.props.discipline.id }}
                urlParams={{ disciplineId: this.props.discipline.id }}
                onEquipmentTypeSelected={this.onEquipmentSelected}
                projectId={this.props.projectId}>
            </EquipmentSelector>
            :
            <TagPanel
                discipline={this.props.discipline}
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

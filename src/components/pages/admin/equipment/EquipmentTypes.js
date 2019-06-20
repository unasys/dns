import React, { Component } from "react";
import './styles/EquipmentTypes.scss';
import ActionPanel from "./ActionPanel";
import EquipmentTypesTable from "./EquipmentTypesTable";

class EquipmentTypes extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedEquipmentType: null
        }
        this.selectEquipmentType = this.selectEquipmentType.bind(this);
    }

    selectEquipmentType(equipmentType) {
        this.setState({
            selectedEquipmentType: equipmentType
        })
    }

    render() {
        return (
            <div className="equipment-types-grid-container">
                <div className="main-content">
                    <EquipmentTypesTable projectId={this.props.projectId} selectEquipmentType={this.selectEquipmentType}></EquipmentTypesTable>
                </div>
                <div className="right-sidebar">
                    <ActionPanel entity="Equipment Type" projectId={this.props.projectId} selectedEquipmentType={this.state.selectedEquipmentType}></ActionPanel>
                </div>
            </div>
        )
    }
}

export default EquipmentTypes;
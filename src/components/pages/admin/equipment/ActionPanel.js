import React, { Component } from "react";
import Modal from "../modals/Modal";
import AddEquipmentType from "./AddEquipmentType";
import UpdateEquipmentTypesDiscipline from "./UpdateEquipmentTypesDiscipline";

class ActionPanel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            createModelOpen: false,
            disciplineModalOpen: false
        }
        this.openCreateModel = this.openCreateModel.bind(this);
        this.closeCreateModel = this.closeCreateModel.bind(this);
        this.openNewDisciplineModal = this.openNewDisciplineModal.bind(this);
        this.closeNewDisciplineModal = this.closeNewDisciplineModal.bind(this);
    }

    openCreateModel() {
        this.setState({
            createModelOpen: true
        })
    }

    closeCreateModel() {
        this.setState({
            createModelOpen: false
        })
    }

    openNewDisciplineModal() {
        this.setState({
            disciplineModalOpen: true
        })
    }

    closeNewDisciplineModal() {
        this.setState({
            disciplineModalOpen: false
        })
    }

    render() {
        return (
            <div className="action-panel">
                <div className="margin-top-left">
                    <button type="button" onClick={this.openCreateModel} className="button is-success">{'Create ' + this.props.entity}</button>
                    <hr />
                    <div className="selected-subsystem-title">
                        <p className="menu-label">Equipment Type</p>
                        {this.props.selectedEquipmentType ? this.props.selectedEquipmentType.name : "Select an Equipment Type"}
                    </div>
                    {this.props.selectedEquipmentType && <button type="button" onClick={this.openNewDisciplineModal} className="button is-primary">{'Assign New Discipline'}</button>}
                </div>
                {this.state.createModelOpen &&
                    <Modal
                        entity={this.props.entity}
                        content={
                            <AddEquipmentType
                                projectId={this.props.projectId}
                                close={this.closeCreateModel}>
                            </AddEquipmentType>}
                        close={this.closeCreateModel}>
                    </Modal>}

                {this.state.disciplineModalOpen &&
                    <Modal
                        entity={this.props.entity}
                        content={
                            <UpdateEquipmentTypesDiscipline
                                projectId={this.props.projectId}
                                close={this.closeNewDisciplineModal}
                                equipmentType={this.props.selectedEquipmentType}>
                            </UpdateEquipmentTypesDiscipline>}
                        close={this.closeNewDisciplineModal}>
                    </Modal>}
            </div>
        )
    }
}

export default ActionPanel;
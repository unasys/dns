import React, { Component } from "react";
import AddModule from "./AddModule";
import Modal from "../modals/Modal";
import UpdateModulesFacility from "./UpdateModulesFacility";

class ActionPanel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            createModelOpen: false,
            assignNewFacilityOpen: false
        }
        this.openCreateModel = this.openCreateModel.bind(this);
        this.closeCreateModel = this.closeCreateModel.bind(this);
        this.openNewFacilityModal = this.openNewFacilityModal.bind(this);
        this.closeNewFacilityModal = this.closeNewFacilityModal.bind(this);
    }

    openNewFacilityModal() {
        this.setState({
            assignNewFacilityOpen: true
        })
    }

    closeNewFacilityModal() {
        this.setState({
            assignNewFacilityOpen: false
        })
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

    render() {
        return (
            <div className="action-panel">
                <div className="margin-top-left">
                    <button type="button" onClick={this.openCreateModel} className="button is-success">{'Create ' + this.props.entity}</button>
                    <hr />
                    <div className="selected-subsystem-title">
                        <p className="menu-label">Module</p>
                        {this.props.selectedModule ? this.props.selectedModule.name : "Select a Module"}
                    </div>
                    {this.props.selectedModule && <button type="button" onClick={this.openNewFacilityModal} className="button is-primary">{'Assign New Facility'}</button>}
                </div>
                {this.state.createModelOpen &&
                    <Modal
                        entity={this.props.entity}
                        content={
                            <AddModule
                                projectId={this.props.projectId}
                                close={this.closeCreateModel}>
                            </AddModule>}
                        close={this.closeCreateModel}>
                    </Modal>}

                {this.state.assignNewFacilityOpen &&
                    <Modal
                        entity={this.props.entity}
                        content={
                            <UpdateModulesFacility
                                projectId={this.props.projectId}
                                close={this.closeNewFacilityModal}
                                moduleObject={this.props.selectedModule}>
                            </UpdateModulesFacility>}
                        close={this.closeNewFacilityModal}>
                    </Modal>}
            </div>
        )
    }
}

export default ActionPanel;
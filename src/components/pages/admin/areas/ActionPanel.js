import React, { Component } from "react";
import Modal from "../modals/Modal";
import AddArea from "./AddArea";
import UpdateAreasModule from "./UpdateAreasModule";

class ActionPanel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            createModelOpen: false
        }
        this.openCreateModel = this.openCreateModel.bind(this);
        this.closeCreateModel = this.closeCreateModel.bind(this);
        this.openNewModuleModal = this.openNewModuleModal.bind(this);
        this.closeNewModuleModal = this.closeNewModuleModal.bind(this);
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

    openNewModuleModal() {
        this.setState({
            moduleModalOpen: true
        })
    }

    closeNewModuleModal() {
        this.setState({
            moduleModalOpen: false
        })
    }

    render() {
        return (
            <div className="action-panel">
                <div className="margin-top-left">
                    <button type="button" onClick={this.openCreateModel} className="button is-success">{'Create ' + this.props.entity}</button>
                    <hr />
                    <div className="selected-subsystem-title">
                        <p className="menu-label">Area</p>
                        {this.props.selectedArea ? this.props.selectedArea.name : "Select an Area"}
                    </div>
                    {this.props.selectedArea && <button type="button" onClick={this.openNewModuleModal} className="button is-primary">{'Assign New Module'}</button>}
                </div>

                {this.state.createModelOpen &&
                    <Modal
                        entity={this.props.entity}
                        content={
                            <AddArea
                                projectId={this.props.projectId}
                                close={this.closeCreateModel}>
                            </AddArea>}
                        close={this.closeCreateModel}>
                    </Modal>}

                {this.state.moduleModalOpen &&
                    <Modal
                        entity={this.props.entity}
                        content={
                            <UpdateAreasModule
                                projectId={this.props.projectId}
                                close={this.closeNewModuleModal}
                                area={this.props.selectedArea}>
                            </UpdateAreasModule>}
                        close={this.closeNewModuleModal}>
                    </Modal>}
            </div>
        )
    }
}

export default ActionPanel;
import React, { Component } from "react";
import AddSystem from "./AddSystem";
import Modal from "../modals/Modal";
import UpdateSystemStatus from "./UpdateSystemsStatus";
import UpdateSystemProductionUnit from "./UpdateSystemProductionUnit";

class ActionPanel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            createModelOpen: false,
            assignStatusOpen: false,
            assignProductionUnitOpen: false
        }
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    openModal(modalName) {
        this.setState({
            [modalName + 'Open']: true
        })
    }

    closeModal(modalName) {
        this.setState({
            [modalName + 'Open']: false
        })
    }

    render() {
        return (
            <div className="action-panel">
                <div className="margin-top-left">
                    <button type="button" onClick={this.openModal.bind(this, 'createModel')} className="button is-success">{'Create ' + this.props.entity}</button>
                    <hr />
                    <div className="selected-system-title">
                        <p className="menu-label">System</p>
                        {this.props.selectedSystem ? this.props.selectedSystem.name + ' - ' + this.props.selectedSystem.detail : "Select a Subsystem"}
                    </div>
                    {this.props.selectedSystem && <button type="button" onClick={this.openModal.bind(this, 'assignStatus')} className="button is-primary">{'Assign New Status'}</button>}
                    {this.props.selectedSystem && <button type="button" onClick={this.openModal.bind(this, 'assignProductionUnit')} className="button is-primary">{'Assign Production Unit'}</button>}
                </div>
                {this.state.createModelOpen &&
                    <Modal
                        entity={this.props.entity}
                        content={
                            <AddSystem
                                projectId={this.props.projectId}
                                close={this.closeModal.bind(this, 'createModel')}>
                            </AddSystem>}
                        close={this.closeModal.bind(this, 'createModel')}>
                    </Modal>}

                {this.state.assignStatusOpen &&
                    <Modal
                        entity={this.props.entity}
                        content={
                            <UpdateSystemStatus
                                projectId={this.props.projectId}
                                system={this.props.selectedSystem}
                                close={this.closeModal.bind(this, 'assignStatus')}>
                            </UpdateSystemStatus>}
                        close={this.closeModal.bind(this, 'assignStatus')}>
                    </Modal>}

                {this.state.assignProductionUnitOpen &&
                    <Modal
                        entity={this.props.entity}
                        content={
                            <UpdateSystemProductionUnit
                                projectId={this.props.projectId}
                                system={this.props.selectedSystem}
                                close={this.closeModal.bind(this, 'assignProductionUnit')}>
                            </UpdateSystemProductionUnit>}
                        close={this.closeModal.bind(this, 'assignProductionUnit')}>
                    </Modal>}
            </div>
        )
    }
}

export default ActionPanel;
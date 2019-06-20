import React, { Component } from "react";
import AddSubsystem from "./AddSubsystem";
import Modal from "../modals/Modal";
import axios from 'axios';
import './styles/Subsystems.scss';
import UpdateSubsystemSystem from "./UpdateSubsystemSystem";

const CancelToken = axios.CancelToken;

class ActionPanel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            createModelOpen: false,
            updateSystemModalOpen: false,
            systemDropdownActive: false,
        }
        this.source = CancelToken.source();
        this.openCreateModel = this.openCreateModel.bind(this);
        this.closeCreateModel = this.closeCreateModel.bind(this);
        this.openUpdateSystemModal = this.openUpdateSystemModal.bind(this);
        this.closeUpdateSystemModal = this.closeUpdateSystemModal.bind(this);
        this.systemDropdownClick = this.systemDropdownClick.bind(this);
    }

    systemDropdownClick() {
        this.setState({
            systemDropdownActive: !this.state.systemDropdownActive
        })
    }

    componentWillUnmount() {
        this.source.cancel();
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

    openUpdateSystemModal() {
        this.setState({
            updateSystemModalOpen: true
        })
    }

    closeUpdateSystemModal() {
        this.setState({
            updateSystemModalOpen: false
        })
    }


    render() {
        return (
            <div className="action-panel">
                <div className="margin-top-left">
                    <button type="button" onClick={this.openCreateModel} className="button is-success">{'Create ' + this.props.entity}</button>
                    <hr />
                    <div className="selected-subsystem-title">
                        <p className="menu-label">Subsystem</p>
                        {this.props.selectedSubsystem ? this.props.selectedSubsystem.detail : "Select a Subsystem"}
                    </div>
                    {this.props.selectedSubsystem && <button type="button" onClick={this.openUpdateSystemModal} className="button is-primary">{'Assign New System'}</button>}
                </div>
                {this.state.createModelOpen &&
                    <Modal entity={this.props.entity} content={<AddSubsystem projectId={this.props.projectId} close={this.closeCreateModel}></AddSubsystem>} close={this.closeCreateModel}></Modal>}
                {this.state.updateSystemModalOpen && this.props.selectedSubsystem !== null &&
                    <Modal entity={this.props.entity} content={<UpdateSubsystemSystem projectId={this.props.projectId} subsystem={this.props.selectedSubsystem} close={this.closeUpdateSystemModal}></UpdateSubsystemSystem>} close={this.closeUpdateSystemModal}></Modal>}
            </div>
        )
    }
}

export default ActionPanel;
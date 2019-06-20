import React, { Component } from "react";
import AddLocation from "./AddLocation";
import Modal from "../modals/Modal";
import UpdateLocationsArea from './UpdateLocationsArea';

class ActionPanel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            createModelOpen: false
        }
        this.openCreateModel = this.openCreateModel.bind(this);
        this.closeCreateModel = this.closeCreateModel.bind(this);
        this.openNewAreaModal = this.openNewAreaModal.bind(this);
        this.closeNewAreaModal = this.closeNewAreaModal.bind(this);
    }

    openNewAreaModal() {
        this.setState({
            moveAreaOpen: true
        })
    }

    closeNewAreaModal() {
        this.setState({
            moveAreaOpen: false
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
                        <p className="menu-label">Location</p>
                        {this.props.selectedLocation ? this.props.selectedLocation.name : "Select a Location"}
                    </div>
                    {this.props.selectedLocation && <button type="button" onClick={this.openNewAreaModal} className="button is-primary">{'Assign New Area'}</button>}
                </div>
                {this.state.createModelOpen &&
                    <Modal
                        entity={this.props.entity}
                        content={
                            <AddLocation
                                projectId={this.props.projectId}
                                close={this.closeCreateModel}>
                            </AddLocation>}
                        close={this.closeCreateModel}>
                    </Modal>}

                {this.state.moveAreaOpen &&
                    <Modal
                        entity={this.props.entity}
                        content={
                            <UpdateLocationsArea
                                projectId={this.props.projectId}
                                close={this.closeNewAreaModal}
                                location={this.props.selectedLocation}>
                            </UpdateLocationsArea>}
                        close={this.closeNewAreaModal}>
                    </Modal>}
            </div>
        )
    }
}

export default ActionPanel;
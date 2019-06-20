import React, { Component } from "react";
import Modal from "../modals/Modal";
import AddTag from "./AddTag";
import UpdateTagSubsystem from "./UpdateTagSubsystem";
import UpdateTagCondition from "./UpdateTagCondition";
import UpdateTagCriticality from "./UpdateTagCriticality";
import UpdateTagStatus from "./UpdateTagStatus";
import UpdateTagEquipmentType from "./UpdateTagEquipmentType";

class ActionPanel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            createModelOpen: false,
            moveSubsystemOpen: false,
            assignConditionOpen: false,
            assignCriticalityOpen: false,
            assignStatusOpen: false,
            assignEquipmentTypeOpen: false

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
                    <div className="selected-subsystem-title">
                        <p className="menu-label">tag</p>
                        {this.props.selectedTag ? this.props.selectedTag.name : "Select a Tag"}
                    </div>
                    {this.props.selectedTag && <button type="button" onClick={this.openModal.bind(this, 'moveSubsystem')} className="button is-primary">{'Assign New Subsystem'}</button>}
                    {this.props.selectedTag && <button type="button" onClick={this.openModal.bind(this, 'assignCondition')} className="button is-primary">{'Assign New Condition'}</button>}
                    {this.props.selectedTag && <button type="button" onClick={this.openModal.bind(this, 'assignCriticality')} className="button is-primary">{'Assign New Criticality'}</button>}
                    {this.props.selectedTag && <button type="button" onClick={this.openModal.bind(this, 'assignStatus')} className="button is-primary">{'Assign New Status'}</button>}
                    {this.props.selectedTag && <button type="button" onClick={this.openModal.bind(this, 'assignEquipmentType')} className="button is-primary">{'Assign New Equipment Type'}</button>}
                </div>
                {this.state.createModelOpen &&
                    <Modal
                        entity={this.props.entity}
                        content={
                            <AddTag
                                projectId={this.props.projectId}
                                close={this.closeModal.bind(this, 'createModel')}>
                            </AddTag>}
                        close={this.closeModal.bind(this, 'createModel')}>
                    </Modal>}

                {this.state.moveSubsystemOpen &&
                    <Modal
                        entity={this.props.entity}
                        content={
                            <UpdateTagSubsystem
                                projectId={this.props.projectId}
                                close={this.closeModal.bind(this, 'moveSubsystem')}
                                tag={this.props.selectedTag}>
                            </UpdateTagSubsystem>}
                        close={this.closeModal.bind(this, 'moveSubsystem')}>
                    </Modal>}

                {this.state.assignConditionOpen &&
                    <Modal
                        entity={this.props.entity}
                        content={
                            <UpdateTagCondition
                                projectId={this.props.projectId}
                                close={this.closeModal.bind(this, 'assignCondition')}
                                tag={this.props.selectedTag}>
                            </UpdateTagCondition>}
                        close={this.closeModal.bind(this, 'assignCondition')}>
                    </Modal>}

                {this.state.assignCriticalityOpen &&
                    <Modal
                        entity={this.props.entity}
                        content={
                            <UpdateTagCriticality
                                projectId={this.props.projectId}
                                close={this.closeModal.bind(this, 'assignCriticality')}
                                tag={this.props.selectedTag}>
                            </UpdateTagCriticality>}
                        close={this.closeModal.bind(this, 'assignCriticality')}>
                    </Modal>}

                {this.state.assignStatusOpen &&
                    <Modal
                        entity={this.props.entity}
                        content={
                            <UpdateTagStatus
                                projectId={this.props.projectId}
                                close={this.closeModal.bind(this, 'assignStatus')}
                                tag={this.props.selectedTag}>
                            </UpdateTagStatus>}
                        close={this.closeModal.bind(this, 'assignStatus')}>
                    </Modal>}
                {this.state.assignEquipmentTypeOpen &&
                    <Modal
                        entity={this.props.entity}
                        content={
                            <UpdateTagEquipmentType
                                projectId={this.props.projectId}
                                close={this.closeModal.bind(this, 'assignEquipmentType')}
                                tag={this.props.selectedTag}>
                            </UpdateTagEquipmentType>}
                        close={this.closeModal.bind(this, 'assignEquipmentType')}>
                    </Modal>}

            </div>
        )
    }
}

export default ActionPanel;
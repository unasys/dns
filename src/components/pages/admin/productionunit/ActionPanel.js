import React, { Component } from "react";
import AddProductionUnit from "./AddProductionUnit";
import Modal from "../modals/Modal";
import UpdateProductionUnitsType from "./UpdateProductionUnitsType";

class ActionPanel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            createModelOpen: false,
            assignProductionUnitTypeOpen: false
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
                        <p className="menu-label">Production Unit</p>
                        {this.props.selectedProductionUnit ? this.props.selectedProductionUnit.name + ' - ' + this.props.selectedProductionUnit.detail : "Select a Production Unit"}
                    </div>
                    {this.props.selectedProductionUnit && <button type="button" onClick={this.openModal.bind(this, 'assignProductionUnitType')} className="button is-primary">{'Assign New Production Unit Type'}</button>}
                </div>
                {this.state.createModelOpen &&
                    <Modal
                        entity={this.props.entity}
                        content={
                            <AddProductionUnit
                                projectId={this.props.projectId}
                                close={this.closeModal.bind(this, 'createModel')}>
                            </AddProductionUnit>}
                        close={this.closeModal.bind(this, 'createModel')}>
                    </Modal>}

                {this.state.assignProductionUnitTypeOpen &&
                    <Modal
                        entity={this.props.entity}
                        content={
                            <UpdateProductionUnitsType
                                projectId={this.props.projectId}
                                productionUnit={this.props.selectedProductionUnit}
                                close={this.closeModal.bind(this, 'assignProductionUnitType')}>
                            </UpdateProductionUnitsType>}
                        close={this.closeModal.bind(this, 'assignProductionUnitType')}>
                    </Modal>}
            </div>
        )
    }
}

export default ActionPanel;
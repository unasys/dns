import React, { Component } from "react";
import Modal from "../modals/Modal";
import AddDiscipline from "./AddDiscipline";

class DisciplinePanel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            createModelOpen: false
        }
        this.openCreateModel = this.openCreateModel.bind(this);
        this.closeCreateModel = this.closeCreateModel.bind(this);
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
                </div>
                {this.state.createModelOpen &&
                    <Modal entity={this.props.entity} content={<AddDiscipline projectId={this.props.projectId} close={this.closeCreateModel}></AddDiscipline>} close={this.closeCreateModel}></Modal>}
            </div>
        )
    }
}

export default DisciplinePanel;
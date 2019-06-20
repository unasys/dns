import React, { Component } from "react";
import './styles/AddTag.scss';
import axios from 'axios';
import Updated from "../../../visuals/user-feedback/Updated";
import EquipmentTypeSelector from "../panels/selectors/EquipmentTypeSelector";
import { updateEquipmentType } from "../../../../api/Tags";

const CancelToken = axios.CancelToken;

class UpdateTagEquipmentType extends Component {

    constructor(props) {
        super(props);
        this.source = CancelToken.source();
        this.state = {
            updated: false,
            selectedEquipmentType: null,
            equipmentTypeError: ''
        }
        this.clearEquipmentTypeSelected = this.clearEquipmentTypeSelected.bind(this);
        this.clientSideValidation = this.clientSideValidation.bind(this);
        this.updateTagsEquipmentType = this.updateTagsEquipmentType.bind(this);
        this.equipmentTypeSelected = this.equipmentTypeSelected.bind(this);
    }

    componentWillUnmount() {
        this.source.cancel()
    }

    // on form change - reset error text. 
    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value, [`${e.target.name}Error`]: '' })
    }

    clientSideValidation() {
        let passed = true;
        if (this.state.selectedEquipmentType === null) {
            this.setState({
                equipmentTypeError: 'Equipment Type is required!'
            })
            passed = false;
        }
        return passed;
    }

    equipmentTypeSelected(equipmentType) {
        this.setState({
            selectedEquipmentType: equipmentType,
            equipmentTypeError: ''
        })
    }

    clearEquipmentTypeSelected() {
        this.setState({
            selectedEquipmentType: null,
            equipmentTypeError: ''
        })
    }

    resetUpdatedState() {
        this.setState({
            updated: false
        })
    }

    updateTagsEquipmentType(e) {
        e.preventDefault();
        e.target.className += ' was-validated';

        if (!this.clientSideValidation()) {
            return;
        }

        let body = {
            equipmentTypeId: this.state.selectedEquipmentType.id
        }

        updateEquipmentType(this.props.projectId, this.props.tag.id, body, this.source.token)
            .then(payload => {
                // Server side validation.
                if (payload.status === 201) {
                    // success 
                    this.setState({
                        updated: true
                    })
                } else {
                    //error
                    switch (payload.data.Case) {
                        case 'AlreadyAssignedtoEquipment':
                            this.setState({
                                equipmentTypeError: 'The tag already has that equipment type!'
                            })
                            break;
                        default:
                            return; // currently silently erroring
                    }
                }
            })
    }

    render() {
        let content;
        if (this.state.updated) {
            content = <Updated entityName="Tag's equipment type"></Updated>
            new Promise(resolve => setTimeout(resolve, 1500)).then(res => {
                this.resetUpdatedState();
                this.props.close();
            });
        } else {
            content = (
                <div className="add-tag-container">
                    <h1 className="title">
                        Update Tag - Equipment Type
                    </h1>
                    <form onSubmit={this.updateTagsEquipmentType}>
                        <p className="menu-label">Current Equipment Type - <span>{this.props.tag.equipmentTypeName && this.props.tag.equipmentTypeName.length !== 0 ? this.props.tag.equipmentTypeName : 'None'}</span></p>
                        <div className={"equipmentTypes-container" + (this.state.equipmentTypeError.length > 0 ? ' is-danger' : '')}>
                            <EquipmentTypeSelector
                                projectId={this.props.projectId}
                                onEquipmentTypeFilter={this.equipmentTypeSelected}
                                selectedEquipmentType={this.state.selectedEquipmentType}
                                clearEquipmentTypeSelected={this.clearEquipmentTypeSelected}>
                            </EquipmentTypeSelector>
                        </div>
                        <p className="help is-danger">
                            {this.state.equipmentTypeError}
                        </p>
                        <br />
                        {this.state.selectedEquipmentType !== null && <p className="menu-label">New Equipment Type - {this.state.selectedEquipmentType.name}</p>}
                        <button type="submit" className="button is-link">Submit</button>
                    </form>
                </div>
            )
        }
        return (
            <div className="add-tag-container border rounded">
                <div className="close-button-container"><i className="fas fa-times close-button" onClick={this.props.close}></i></div>
                {content}
            </div>
        )
    }
}

export default UpdateTagEquipmentType;
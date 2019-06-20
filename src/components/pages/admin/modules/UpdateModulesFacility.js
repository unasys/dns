import React, { Component } from "react";
import './styles/AddModule.scss';
import axios from 'axios';
import Updated from "../../../visuals/user-feedback/Updated";
import FacilitySelector from "../panels/selectors/FacilitySelector";
import { moveModuleFacility } from "../../../../api/Modules";

const CancelToken = axios.CancelToken;

class UpdateModulesFacility extends Component {

    constructor(props) {
        super(props);
        this.source = CancelToken.source();
        this.state = {
            updated: false,
            selectedFacility: null,
            facilityError: ''
        }
        this.clearFacilitySelected = this.clearFacilitySelected.bind(this);
        this.facilitySelected = this.facilitySelected.bind(this);
        this.clientSideValidation = this.clientSideValidation.bind(this);
        this.updateModulesFacility = this.updateModulesFacility.bind(this);
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
        if (this.state.selectedFacility === null) {
            this.setState({
                facilityError: 'Facility is required!'
            })
            passed = false;
        }
        return passed;
    }

    facilitySelected(facility) {
        this.setState({
            selectedFacility: facility,
            facilityError: ''
        })
    }

    clearFacilitySelected() {
        this.setState({
            selectedFacility: null,
            facilityError: ''
        })
    }

    resetUpdatedState() {
        this.setState({
            updated: false
        })
    }

    updateModulesFacility(e) {
        e.preventDefault();
        e.target.className += ' was-validated';

        if (!this.clientSideValidation()) {
            return;
        }

        let body = {
            facilityId: this.state.selectedFacility.id
        }

        moveModuleFacility(this.props.projectId, this.props.moduleObject.id, body, this.source.token)
            .then(payload => {
                // Server side validation.
                console.log('ok');
                if (payload.status === 201) {
                    // success 
                    this.setState({
                        updated: true
                    })
                } else {
                    //error
                    console.log(payload.data.Case);
                    switch (payload.data.Case) {
                        case 'AlreadyInFacility':
                            this.setState({
                                facilityError: 'The module is already in that facility!'
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
            content = <Updated entityName="Module's Facility"></Updated>
            new Promise(resolve => setTimeout(resolve, 1500)).then(res => {
                this.resetUpdatedState();
                this.props.close();
            });
        } else {
            console.log(this.props.moduleObject);
            content = (
                <div className="add-module-container">
                    <h1 className="title">
                        Update Module
                    </h1>
                    <form onSubmit={this.updateModulesFacility}>
                        <p className="menu-label">Current Facility - <span>{this.props.moduleObject && this.props.moduleObject.facilityName.length !== 0 ? this.props.moduleObject.facilityName : 'None'}</span></p>
                        <div className={"facilities-container" + (this.state.facilityError.length > 0 ? ' is-danger' : '')}>
                            <FacilitySelector
                                projectId={this.props.projectId}
                                onFacilityFilter={this.facilitySelected}
                                selectedFacility={this.state.selectedFacility}>
                            </FacilitySelector>
                        </div>
                        <p className="help is-danger">
                            {this.state.facilityError}
                        </p>
                        <br />
                        {this.state.selectedFacility !== null && <p className="menu-label">New Facility - {this.state.selectedFacility.name}</p>}
                        <button type="submit" className="button is-link">Submit</button>
                    </form>
                </div>
            )
        }
        return (
            <div className="add-module-container border rounded">
                <div className="close-button-container"><i className="fas fa-times close-button" onClick={this.props.close}></i></div>
                {content}
            </div>
        )
    }
}

export default UpdateModulesFacility;
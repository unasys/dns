import React, { Component } from "react";
import './styles/AddModule.scss';
import axios from 'axios';
import Created from "../../../visuals/user-feedback/Created";
import { createNewModule } from "../../../../api/Modules";
import FacilitySelector from "../panels/selectors/FacilitySelector";

const CancelToken = axios.CancelToken;

class AddFacility extends Component {

    constructor(props) {
        super(props);
        this.source = CancelToken.source();
        this.state = {
            name: '',
            nameError: '',
            detail: '',
            detailError: '',
            facilitySelected: null,
            created: false
        }
        this.createNewModule = this.createNewModule.bind(this);
        this.clearFacilitySelected = this.clearFacilitySelected.bind(this);
        this.onFacilityFilter = this.onFacilityFilter.bind(this);
    }

    clearFacilitySelected() {
        this.setState({
            facilitySelected: null
        })
    }

    onFacilityFilter(facility) {
        this.setState({
            facilitySelected: facility
        })
    }

    componentWillUnmount() {
        this.source.cancel()
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value, [`${e.target.name}Error`]: '' })
    }

    clientSideValidation() {
        if (this.state.name.length === 0) {
            this.setState({
                nameError: 'Name is required!'
            })
            return false;
        }
        if (this.state.detail.length === 0) {
            this.setState({
                detailError: 'Detail is required!'
            })
            return false;
        }
        return true;
    }

    resetCreatedState() {
        this.setState({
            created: false
        })
    }

    createNewModule(e) {
        e.preventDefault();
        e.target.className += ' was-validated';

        if (!this.clientSideValidation()) {
            return;
        }


        let body = {
            name: this.state.name,
            detail: this.state.detail
        }

        if (this.state.facilitySelected) {
            body.facilityId = this.state.facilitySelected.id
        }

        createNewModule(this.props.projectId, body, this.source.token)
            .then(payload => {
                // Server side validation.
                if (payload.status === 201) {
                    // success 
                    this.setState({
                        created: true,
                        facilitySelected: null
                    })
                } else {
                    //error
                    switch (payload.data.Case) {
                        case 'ModuleNameAlreadyExists':
                            this.setState({
                                nameError: 'That name already exists!'
                            })
                            break;
                        default:
                            return; // currently silently erroring
                    }
                }
            }
            ).catch((e) => {
                console.error('something went wrong when fetching installations in addsystem.js', e);
            })
    }

    render() {
        let content;
        if (this.state.created) {
            content = <Created entityName="Module"></Created>
            new Promise(resolve => setTimeout(resolve, 1500)).then(res => {
                this.resetCreatedState();
            });
        } else {
            content = (
                <div className="add-module-container">
                    <h1 className="title">
                        Create Module
                    </h1>
                    <form onSubmit={this.createNewModule}>
                        <div className="field">
                            <label className="label">Name</label>
                            <div className="control">
                                <input type="text" name="name" onBlur={e => this.onChange(e)} className={"input" + (this.state.nameError.length > 0 ? ' is-danger' : '')} placeholder="Enter Name" required />
                                <p className="help is-danger">
                                    {this.state.nameError}
                                </p>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Detail</label>
                            <input type="text" name="detail" onBlur={e => this.onChange(e)} className={"input" + (this.state.detailError.length > 0 ? ' is-danger' : '')} placeholder="Detail" />
                            <p className="help is-danger">
                                {this.state.detailError}
                            </p>
                        </div>
                        <label className="label">Facility</label>

                        <p className="menu-label">{"Selected Facility - " + (this.state.facilitySelected ? this.state.facilitySelected.name : "")}</p>
                        <div className={"facilities-container"}>
                            <FacilitySelector
                                projectId={this.props.projectId}
                                onFacilityFilter={this.onFacilityFilter}
                                selectedFacility={this.state.facilitySelected}
                                clearFacilitySelected={this.clearFacilitySelected}>
                            </FacilitySelector>
                        </div>
                        <button type="submit" className="button is-link">Submit</button>
                    </form>
                </div >
            )
        }
        return (
            <div className="add-module-container border rounded" >
                <div className="close-button-container"><i className="fas fa-times close-button" onClick={this.props.close}></i></div>
                {content}
            </div>
        )
    }
}

export default AddFacility;
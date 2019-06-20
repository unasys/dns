import React, { Component } from "react";
import './styles/AddLocation.scss';
import axios from 'axios';
import Created from "../../../visuals/user-feedback/Created";
import { createNewLocation } from "../../../../api/Locations";
import AreaSelector from "../panels/selectors/AreaSelector";

const CancelToken = axios.CancelToken;

class AddLocation extends Component {

    constructor(props) {
        super(props);
        this.source = CancelToken.source();
        this.state = {
            name: '',
            nameError: '',
            areaSelected: null,
            created: false
        }
        this.createNewLocation = this.createNewLocation.bind(this);
        this.clearAreaSelected = this.clearAreaSelected.bind(this);
        this.onAreaFilter = this.onAreaFilter.bind(this);
    }

    clearAreaSelected() {
        this.setState({
            areaSelected: null
        })
    }

    onAreaFilter(area) {
        this.setState({
            areaSelected: area
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
        return true;
    }

    resetCreatedState() {
        this.setState({
            created: false
        })
    }

    createNewLocation(e) {
        e.preventDefault();
        e.target.className += ' was-validated';

        if (!this.clientSideValidation()) {
            return;
        }


        let body = {
            name: this.state.name
        }

        if (this.state.areaSelected) {
            body.areaId = this.state.areaSelected.id
        }

        createNewLocation(this.props.projectId, body, this.source.token)
            .then(payload => {
                // Server side validation.
                if (payload.status === 201) {
                    // success 
                    this.setState({
                        created: true,
                        areaSelected: null
                    })
                } else {
                    //error
                    switch (payload.data.Case) {
                        case 'LocationNameAlreadyExists':
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
                console.error('something went wrong when fetching locations in addlocation.js', e);
            })
    }

    render() {
        let content;
        if (this.state.created) {
            content = <Created entityName="Location"></Created>
            new Promise(resolve => setTimeout(resolve, 1500)).then(res => {
                this.resetCreatedState();
            });
        } else {
            content = (
                <div className="add-module-container">
                    <h1 className="title">
                        Create Location
                    </h1>
                    <form onSubmit={this.createNewLocation}>
                        <div className="field">
                            <label className="label">Name</label>
                            <div className="control">
                                <input type="text" name="name" onBlur={e => this.onChange(e)} className={"input" + (this.state.nameError.length > 0 ? ' is-danger' : '')} placeholder="Enter Name" required />
                                <p className="help is-danger">
                                    {this.state.nameError}
                                </p>
                            </div>
                        </div>

                        <label className="label">Area</label>

                        <p className="menu-label">{"Selected Area - " + (this.state.areaSelected ? this.state.areaSelected.name : "")}</p>
                        <div className={"facilities-container"}>
                            <AreaSelector
                                projectId={this.props.projectId}
                                onAreaFilter={this.onAreaFilter}
                                selectedArea={this.state.areaSelected}
                                clearAreaSelected={this.clearAreaSelected}>
                            </AreaSelector>
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

export default AddLocation;
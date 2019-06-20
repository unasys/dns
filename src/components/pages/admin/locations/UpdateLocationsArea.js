import React, { Component } from "react";
import './styles/AddLocation.scss';
import axios from 'axios';
import Updated from "../../../visuals/user-feedback/Updated";
import AreaSelector from "../panels/selectors/AreaSelector";
import { moveLocationsArea } from "../../../../api/Locations";

const CancelToken = axios.CancelToken;

class UpdateLocationsArea extends Component {

    constructor(props) {
        super(props);
        this.source = CancelToken.source();
        this.state = {
            updated: false,
            selectedArea: null,
            areaError: ''
        }
        this.clearAreaSelected = this.clearAreaSelected.bind(this);
        this.areaSelected = this.areaSelected.bind(this);
        this.clientSideValidation = this.clientSideValidation.bind(this);
        this.updateLocationsArea = this.updateLocationsArea.bind(this);
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
        if (this.state.selectedArea === null) {
            this.setState({
                areaError: 'Area is required!'
            })
            passed = false;
        }
        return passed;
    }

    areaSelected(area) {
        this.setState({
            selectedArea: area,
            areaError: ''
        })
    }

    clearAreaSelected() {
        this.setState({
            selectedArea: null,
            areaError: ''
        })
    }

    resetUpdatedState() {
        this.setState({
            updated: false
        })
    }

    updateLocationsArea(e) {
        e.preventDefault();
        e.target.className += ' was-validated';

        if (!this.clientSideValidation()) {
            return;
        }

        let body = {
            areaId: this.state.selectedArea.id
        }

        moveLocationsArea(this.props.projectId, this.props.location.id, body, this.source.token)
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
                        case 'AlreadyInArea':
                            this.setState({
                                areaError: 'The location is already in that area!'
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
            content = <Updated entityName="Location's Area"></Updated>
            new Promise(resolve => setTimeout(resolve, 1500)).then(res => {
                this.resetUpdatedState();
                this.props.close();
            });
        } else {
            content = (
                <div className="add-location-container">
                    <h1 className="title">
                        Update Location
                    </h1>
                    <form onSubmit={this.updateLocationsArea}>
                        <p className="menu-label">Current Area - <span>{this.props.location && this.props.location.areaName.length !== 0 ? this.props.location.areaName : 'None'}</span></p>
                        <div className={"areas-container" + (this.state.areaError.length > 0 ? ' is-danger' : '')}>
                            <AreaSelector
                                projectId={this.props.projectId}
                                onAreaFilter={this.areaSelected}
                                selectedArea={this.state.selectedArea}
                                clearAreaSelected={this.clearAreaSelected}>
                            </AreaSelector>
                        </div>
                        <p className="help is-danger">
                            {this.state.areaError}
                        </p>
                        <br />
                        {this.state.selectedArea !== null && <p className="menu-label">New Area - {this.state.selectedArea.name}</p>}
                        <button type="submit" className="button is-link">Submit</button>
                    </form>
                </div>
            )
        }
        return (
            <div className="add-location-container border rounded">
                <div className="close-button-container"><i className="fas fa-times close-button" onClick={this.props.close}></i></div>
                {content}
            </div>
        )
    }
}

export default UpdateLocationsArea;
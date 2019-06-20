import React, { Component } from "react";
import './styles/AddSubsystem.scss';
import { updateSubsystemsSystem } from "../../../../api/Subsystems";
import axios from 'axios';
import Updated from "../../../visuals/user-feedback/Updated";
import { fetchSystemsCall } from "../../../../api/Systems";
import SystemSelector from "../panels/selectors/SystemSelector";

const CancelToken = axios.CancelToken;

class UpdateSubsystemSystem extends Component {

    constructor(props) {
        super(props);
        this.source = CancelToken.source();
        this.state = {
            updated: false,
            systemSelected: null,
            systemError: ''
        }
        this.clearSystemSelected = this.clearSystemSelected.bind(this);
        this.systemSelected = this.systemSelected.bind(this);
        this.clientSideValidation = this.clientSideValidation.bind(this);
        this.updateSubsystemsSystem = this.updateSubsystemsSystem.bind(this);
    }

    componentDidMount() {
        return fetchSystemsCall(this.props.projectId, this.source.token, 0, 1000) // hardcoded to fetch a thousand until we get an endpoint that pulls them all back regardless.
            .then(payload => {
                this.setState({
                    systems: payload.data._embedded.items
                })
            })
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
        if (this.state.systemSelected === null) {
            this.setState({
                systemError: 'System is required!'
            })
            passed = false;
        }
        return passed;
    }

    systemSelected(system) {
        this.setState({
            systemSelected: system,
            systemError: ''
        })
    }

    clearSystemSelected() {
        this.setState({
            systemSelected: null,
            systemError: ''
        })
    }

    resetUpdatedState() {
        this.setState({
            updated: false
        })
    }

    updateSubsystemsSystem(e) {
        e.preventDefault();
        e.target.className += ' was-validated';

        if (!this.clientSideValidation()) {
            return;
        }

        let body = {
            systemId: this.state.systemSelected.id
        }

        updateSubsystemsSystem(this.props.projectId, this.props.subsystem.id, body, this.source.token)
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
                        // add in errors
                        default:
                            return; // currently silently erroring
                    }
                }
            }
            ).catch((e) => {
                console.error('something went wrong when fetching installations in addsubsystems.js', e);
            })
    }

    render() {
        let content;
        if (this.state.updated) {
            content = <Updated entityName="Subsystem's System"></Updated>
            new Promise(resolve => setTimeout(resolve, 1500)).then(res => {
                this.resetUpdatedState();
                this.props.close();
            });
        } else {
            content = (
                <div className="add-subsystem-container">
                    <h1 className="title">
                        Update System
                    </h1>
                    <form onSubmit={this.updateSubsystemsSystem}>
                        <p className="menu-label">Current System - <span>{this.props.subsystem.systemDetail.length !== 0 ? this.props.subsystem.systemDetail : 'None'}</span></p>
                        <div className={"systems-container" + (this.state.systemError.length > 0 ? ' is-danger' : '')}>
                            <SystemSelector
                                projectId={this.props.projectId}
                                onSystemFilter={this.systemSelected}
                                selectedSystem={this.state.systemSelected}
                                clearSystemSelected={this.clearSystemSelected}>
                            </SystemSelector>
                        </div>
                        <p className="help is-danger">
                            {this.state.systemError}
                        </p>
                        <br />
                        {this.state.systemSelected !== null && <p className="menu-label">New System - {this.state.systemSelected.detail}</p>}
                        <button type="submit" className="button is-link">Submit</button>
                    </form>
                </div>
            )
        }
        return (
            <div className="add-subsystem-container border rounded">
                <div className="close-button-container"><i className="fas fa-times close-button" onClick={this.props.close}></i></div>
                {content}
            </div>
        )
    }
}

export default UpdateSubsystemSystem;
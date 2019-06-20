import React, { Component } from "react";
import './styles/AddSubsystem.scss';
import { createNewSubsystemCall } from "../../../../api/Subsystems";
import axios from 'axios';
import Created from "../../../visuals/user-feedback/Created";
import SystemSelector from "../panels/selectors/SystemSelector";

const CancelToken = axios.CancelToken;

class AddSubsystem extends Component {

    constructor(props) {
        super(props);
        this.source = CancelToken.source();
        this.state = {
            name: '',
            nameError: '',
            systemError: '',
            detail: '',
            systemSelected: null,
            created: false
        }
        this.createNewSystem = this.createNewSystem.bind(this);
        this.systemSelected = this.systemSelected.bind(this);
        this.clearSystemSelected = this.clearSystemSelected.bind(this);
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
        if (this.state.name.length === 0) {
            this.setState({
                nameError: 'Name is required!'
            })
            passed = false;
        }
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

    clearSystemSelected(e) {
        this.setState({
            systemSelected: null,
            systemError: ''
        })
    }

    resetCreatedState() {
        this.setState({
            created: false
        })
    }

    createNewSystem(e) {
        e.preventDefault();
        e.target.className += ' was-validated';

        if (!this.clientSideValidation()) {
            return;
        }

        let body = {
            name: this.state.name,
            detail: this.state.detail,
            systemId: this.state.systemSelected.id
        }

        createNewSubsystemCall(this.props.projectId, body, this.source.token)
            .then(payload => {
                // Server side validation.
                if (payload.status === 201) {
                    // success 
                    this.setState({
                        created: true,
                        systemSelected: null
                    })
                } else {
                    //error
                    switch (payload.data.Case) {
                        case 'SubSystemNameAlreadyExists':
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
                console.error('something went wrong when fetching installations in addsubsystems.js', e);
            })
    }

    render() {
        let content;
        if (this.state.created) {
            content = <Created entityName="System"></Created>
            new Promise(resolve => setTimeout(resolve, 1500)).then(res => {
                this.resetCreatedState();
            });
        } else {
            content = (
                <div className="add-subsystem-container">
                    <h1 className="title">
                        Create Subsystem
                    </h1>
                    <form onSubmit={this.createNewSystem}>
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
                            <input type="text" name="detail" onBlur={e => this.onChange(e)} className="input" placeholder="Detail" />
                        </div>
                        <label className="label">System</label>
                        <p className="menu-label">{"Selected System - " + (this.state.systemSelected ? this.state.systemSelected.name : "")}</p>
                        {/* { this.state.systems.map(system => {
                                return (
                                    <li href="#" key={system.id} className={"dropdown-item " + ((this.state.systemSelected && this.state.systemSelected.id) === system.id ? "selected" : "")} onClick={this.systemSelected.bind(this, system)}>
                                    {system.detail}
                                    </li>
                                    )
                                })} */}
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

export default AddSubsystem;
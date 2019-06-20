import React, { Component } from "react";
import './styles/AddTag.scss';
import axios from 'axios';
import Updated from "../../../visuals/user-feedback/Updated";
import { moveToSubsystem } from "../../../../api/Tags";
import SubsystemSelector from "../panels/selectors/SubsytemSelector";

const CancelToken = axios.CancelToken;

class UpdateTagSubsystem extends Component {

    constructor(props) {
        super(props);
        this.source = CancelToken.source();
        this.state = {
            updated: false,
            selectedSubsystem: null,
            subsystemError: ''
        }
        this.clearSubsystemSelected = this.clearSubsystemSelected.bind(this);
        this.clientSideValidation = this.clientSideValidation.bind(this);
        this.updateTagsSubsystem = this.updateTagsSubsystem.bind(this);
        this.subsystemSelected = this.subsystemSelected.bind(this);
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
        if (this.state.selectedSubsystem === null) {
            this.setState({
                subsystemError: 'Subsystem is required!'
            })
            passed = false;
        }
        return passed;
    }

    subsystemSelected(subsystem) {
        this.setState({
            selectedSubsystem: subsystem,
            subsystemError: ''
        })
    }

    clearSubsystemSelected() {
        this.setState({
            selectedSubsystem: null,
            subsystemError: ''
        })
    }

    resetUpdatedState() {
        this.setState({
            updated: false
        })
    }

    updateTagsSubsystem(e) {
        e.preventDefault();
        e.target.className += ' was-validated';

        if (!this.clientSideValidation()) {
            return;
        }

        let body = {
            SubsystemId: this.state.selectedSubsystem.id
        }

        moveToSubsystem(this.props.projectId, this.props.tag.id, body, this.source.token)
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
                        case 'AlreadyInSubsystem':
                            this.setState({
                                subsystemError: 'The tag is already in that subsystem!'
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
            content = <Updated entityName="Tag's subsystem"></Updated>
            new Promise(resolve => setTimeout(resolve, 1500)).then(res => {
                this.resetUpdatedState();
                this.props.close();
            });
        } else {
            content = (
                <div className="add-tag-container">
                    <h1 className="title">
                        Update Tag - Subsystem
                    </h1>
                    <form onSubmit={this.updateTagsSubsystem}>
                        <p className="menu-label">Current Subsystem - <span>{this.props.tag && this.props.tag.subsystemName.length !== 0 ? this.props.tag.subsystemName : 'None'}</span></p>
                        <div className={"subsystems-container" + (this.state.subsystemError.length > 0 ? ' is-danger' : '')}>
                            <SubsystemSelector
                                projectId={this.props.projectId}
                                onSubsystemFilter={this.subsystemSelected}
                                selectedSubsystem={this.state.selectedSubsystem}
                                clearSubsystemSelected={this.clearSubsystemSelected}>
                            </SubsystemSelector>
                        </div>
                        <p className="help is-danger">
                            {this.state.subsystemError}
                        </p>
                        <br />
                        {this.state.selectedSubsystem !== null && <p className="menu-label">New Subsystem - {this.state.selectedSubsystem.name}</p>}
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

export default UpdateTagSubsystem;
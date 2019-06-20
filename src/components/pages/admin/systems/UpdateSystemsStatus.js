import React, { Component } from "react";
import './styles/AddSystem.scss';
import axios from 'axios';
import Updated from "../../../visuals/user-feedback/Updated";
import { updateSystemsStatus } from "../../../../api/Systems";
import StatusSelector from "../panels/selectors/StatusSelector";

const CancelToken = axios.CancelToken;

class UpdateSystemStatus extends Component {

    constructor(props) {
        super(props);
        this.source = CancelToken.source();
        this.state = {
            updated: false,
            selectedStatus: null,
            statusError: ''
        }
        this.clientSideValidation = this.clientSideValidation.bind(this);
        this.updateSystemStatus = this.updateSystemStatus.bind(this);
        this.statusSelected = this.statusSelected.bind(this);
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
        if (this.state.selectedStatus === null) {
            this.setState({
                statusError: 'Status is required!'
            })
            passed = false;
        }
        return passed;
    }

    statusSelected(Status) {
        this.setState({
            selectedStatus: Status,
            statusError: ''
        })
    }

    clearStatusSelected() {
        this.setState({
            selectedStatus: null,
            statusError: ''
        })
    }

    resetUpdatedState() {
        this.setState({
            updated: false
        })
    }

    updateSystemStatus(e) {
        e.preventDefault();
        e.target.className += ' was-validated';

        if (!this.clientSideValidation()) {
            return;
        }

        let body = {
            status: this.state.selectedStatus.name
        }

        updateSystemsStatus(this.props.projectId, this.props.system.id, body, this.source.token)
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
                        case 'StatusAlreadyAssigned':
                            this.setState({
                                subsystemError: 'The system already has that Status!'
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
            content = <Updated entityName="System's Status"></Updated>
            new Promise(resolve => setTimeout(resolve, 1500)).then(res => {
                this.resetUpdatedState();
                this.props.close();
            });
        } else {
            content = (
                <div className="add-system-container">
                    <h1 className="title">
                        Update system - Status
                    </h1>
                    <form onSubmit={this.updateSystemStatus}>
                        <p className="menu-label">Current Status - <span>{this.props.system.status && this.props.system.status.length !== 0 ? this.props.system.status : 'None'}</span></p>
                        <div className={(this.state.statusError.length > 0 ? ' is-danger' : '')}>
                            <StatusSelector
                                projectId={this.props.projectId}
                                onStatusSelect={this.statusSelected}
                                selectedStatus={this.state.selectedStatus}>
                            </StatusSelector>
                        </div>
                        <p className="help is-danger">
                            {this.state.statusError}
                        </p>
                        <br />
                        {this.state.selectedStatus !== null && <p className="menu-label">New Status - {this.state.selectedStatus.name}</p>}
                        <button type="submit" className="button is-link">Submit</button>
                    </form>
                </div>
            )
        }
        return (
            <div className="add-system-container border rounded">
                <div className="close-button-container"><i className="fas fa-times close-button" onClick={this.props.close}></i></div>
                {content}
            </div>
        )
    }
}

export default UpdateSystemStatus;
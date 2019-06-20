import React, { Component } from "react";
import './styles/AddSystem.scss';
import { createNewSystemCall } from "../../../../api/Systems";
import axios from 'axios';
import Created from "../../../visuals/user-feedback/Created";
import StatusSelector from "../panels/selectors/StatusSelector";

const CancelToken = axios.CancelToken;

class AddSystem extends Component {

    constructor(props) {
        super(props);
        this.source = CancelToken.source();
        this.state = {
            name: '',
            nameError: '',
            detail: '',
            created: false,
            statusSelected: null,

        }
        this.createNewSystem = this.createNewSystem.bind(this);
        this.statusSelected = this.statusSelected.bind(this);
    }

    componentWillUnmount() {
        this.source.cancel()
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value, [`${e.target.name}Error`]: '' })
    }

    statusSelected(status) {
        this.setState({
            statusSelected: status
        })
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

    createNewSystem(e) {
        e.preventDefault();
        e.target.className += ' was-validated';

        if (!this.clientSideValidation()) {
            return;
        }

        let body = {
            name: this.state.name,
            detail: this.state.detail
        }

        if (this.state.statusSelected) {
            body.status = this.state.statusSelected.name
        }
        createNewSystemCall(this.props.projectId, body, this.source.token)
            .then(payload => {
                // Server side validation.
                if (payload.status === 201) {
                    // success 
                    this.setState({
                        created: true,
                        statusSelected: null
                    })
                } else {
                    //error
                    switch (payload.data.Case) {
                        case 'NameAlreadyExists':
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
            content = <Created entityName="System"></Created>
            new Promise(resolve => setTimeout(resolve, 1500)).then(res => {
                this.resetCreatedState();
            });
        } else {
            content = (
                <div className="add-system-container">
                    <h1 className="title">
                        Create System
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
                        <label className="label">Status</label>
                        <p className="menu-label">{"Selected Status - " + (this.state.statusSelected ? this.state.statusSelected.name : "")}</p>
                        <StatusSelector
                            projectId={this.props.projectId}
                            onStatusSelect={this.statusSelected}
                            selectedStatus={this.state.statusSelected}>
                        </StatusSelector>
                        <button type="submit" className="button is-link">Submit</button>
                    </form>
                </div>
            )
        }
        return (
            <div className="add-system-container border rounded" >
                <div className="close-button-container"><i className="fas fa-times close-button" onClick={this.props.close}></i></div>
                {content}
            </div>
        )
    }
}

export default AddSystem;
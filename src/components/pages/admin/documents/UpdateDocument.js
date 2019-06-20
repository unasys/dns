import React, { Component } from "react";
import './styles/AddDocument.scss';
import axios from 'axios';
import Updated from "../../../visuals/user-feedback/Updated";
import { updateDocument } from "../../../../api/Documents";

const CancelToken = axios.CancelToken;

class UpdateDocument extends Component {

    constructor(props) {
        super(props);
        this.source = CancelToken.source();
        this.state = {
            updated: false,
            name: this.props.document.name,
            detail: this.props.document.detail,
            nameError: '',
            detailError: ''
        }
        console.log(this.props.document)
        this.clientSideValidation = this.clientSideValidation.bind(this);
        this.updateDocument = this.updateDocument.bind(this);
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
        if (this.state.name === null) {
            this.setState({
                nameError: 'Name is required!'
            })
            passed = false;
        }
        if (this.state.detail === null) {
            this.setState({
                detailError: 'Detail is required!'
            })
            passed = false;
        }
        return passed;
    }

    resetUpdatedState() {
        this.setState({
            updated: false
        })
    }

    updateDocument(e) {
        e.preventDefault();
        e.target.className += ' was-validated';

        if (!this.clientSideValidation()) {
            return;
        }

        let body = {
            name: this.state.name,
            detail: this.state.detail
        }

        updateDocument(this.props.projectId, this.props.document.id, body, this.source.token)
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
                        default:
                            return; // currently silently erroring
                    }
                }
            })
    }

    render() {
        let content;
        if (this.state.updated) {
            content = <Updated entityName="Document"></Updated>
            new Promise(resolve => setTimeout(resolve, 1500)).then(res => {
                this.resetUpdatedState();
                this.props.close();
            });
        } else {
            content = (
                <div className="add-document-container">
                    <h1 className="title">
                        Update Document
                    </h1>
                    <form onSubmit={this.updateDocument}>
                        <div className="field">
                            <label className="label">Name</label>
                            <div className="control">
                                <input type="text" name="name" onBlur={e => this.onChange(e)} className={"input" + (this.state.nameError.length > 0 ? ' is-danger' : '')} placeholder="Enter Name" defaultValue={this.state.name} required />
                                <p className="help is-danger">
                                    {this.state.nameError}
                                </p>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Detail</label>
                            <div className="control">
                                <input type="text" name="detail" onBlur={e => this.onChange(e)} className={"input" + (this.state.detailError.length > 0 ? ' is-danger' : '')} placeholder="Enter Detail" defaultValue={this.state.detail} required />
                                <p className="help is-danger">
                                    {this.state.detailError}
                                </p>
                            </div>
                        </div>
                        <button type="submit" className="button is-link">Submit</button>
                    </form>
                </div>
            )
        }
        return (
            <div className="add-document-container border rounded">
                <div className="close-button-container"><i className="fas fa-times close-button" onClick={this.props.close}></i></div>
                {content}
            </div>
        )
    }
}

export default UpdateDocument;
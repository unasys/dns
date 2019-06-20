import React, { Component } from "react";
import './styles/AddArea.scss';
import axios from 'axios';
import Created from "../../../visuals/user-feedback/Created";
import { createNewArea } from "../../../../api/Areas";
import ModuleSelector from "../panels/selectors/ModuleSelector";

const CancelToken = axios.CancelToken;

class AddArea extends Component {

    constructor(props) {
        super(props);
        this.source = CancelToken.source();
        this.state = {
            name: '',
            nameError: '',
            detail: '',
            detailError: '',
            moduleSelected: null,
            created: false
        }
        this.createNewArea = this.createNewArea.bind(this);
        this.clearModuleSelected = this.clearModuleSelected.bind(this);
        this.onModuleFilter = this.onModuleFilter.bind(this);
    }

    clearModuleSelected() {
        this.setState({
            moduleSelected: null
        })
    }

    onModuleFilter(moduleObject) {
        this.setState({
            moduleSelected: moduleObject
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

    createNewArea(e) {
        e.preventDefault();
        e.target.className += ' was-validated';

        if (!this.clientSideValidation()) {
            return;
        }


        let body = {
            name: this.state.name,
            detail: this.state.detail
        }

        if (this.state.moduleSelected) {
            body.moduleId = this.state.moduleSelected.id
        }

        createNewArea(this.props.projectId, body, this.source.token)
            .then(payload => {
                // Server side validation.
                if (payload.status === 201) {
                    // success 
                    this.setState({
                        created: true,
                        moduleSelected: null
                    })
                } else {
                    //error
                    switch (payload.data.Case) {
                        case 'AreaNameAlreadyExists':
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
                console.error('something went wrong when fetching areas in addarea.js', e);
            })
    }

    render() {
        let content;
        if (this.state.created) {
            content = <Created entityName="Area"></Created>
            new Promise(resolve => setTimeout(resolve, 1500)).then(res => {
                this.resetCreatedState();
            });
        } else {
            content = (
                <div className="add-area-container">
                    <h1 className="title">
                        Create Area
                    </h1>
                    <form onSubmit={this.createNewArea}>
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
                        <label className="label">Module</label>

                        <p className="menu-label">{"Selected Module - " + (this.state.moduleSelected ? this.state.moduleSelected.name : "")}</p>
                        <div className={"modules-container"}>
                            <ModuleSelector
                                projectId={this.props.projectId}
                                onModuleFilter={this.onModuleFilter}
                                selectedModule={this.state.moduleSelected}
                                clearModuleSelected={this.clearAreaSeleclearModuleSelectedcted}>
                            </ModuleSelector>
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

export default AddArea;
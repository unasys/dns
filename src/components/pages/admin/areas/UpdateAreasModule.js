import React, { Component } from "react";
import './styles/AddArea.scss';
import axios from 'axios';
import Updated from "../../../visuals/user-feedback/Updated";
import { moveAreasModule } from "../../../../api/Areas";
import ModuleSelector from "../panels/selectors/ModuleSelector";

const CancelToken = axios.CancelToken;

class UpdateAreasModule extends Component {

    constructor(props) {
        super(props);
        this.source = CancelToken.source();
        this.state = {
            updated: false,
            selectedModule: null,
            moduleError: ''
        }
        this.clearModuleSelected = this.clearModuleSelected.bind(this);
        this.clientSideValidation = this.clientSideValidation.bind(this);
        this.updateAreasModule = this.updateAreasModule.bind(this);
        this.moduleSelected = this.moduleSelected.bind(this);
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
        if (this.state.selectedModule === null) {
            this.setState({
                moduleError: 'Module is required!'
            })
            passed = false;
        }
        return passed;
    }

    moduleSelected(area) {
        this.setState({
            selectedModule: area,
            moduleError: ''
        })
    }

    clearModuleSelected() {
        this.setState({
            selectedModule: null,
            moduleError: ''
        })
    }

    resetUpdatedState() {
        this.setState({
            updated: false
        })
    }

    updateAreasModule(e) {
        e.preventDefault();
        e.target.className += ' was-validated';

        if (!this.clientSideValidation()) {
            return;
        }

        let body = {
            ModuleId: this.state.selectedModule.id
        }

        moveAreasModule(this.props.projectId, this.props.area.id, body, this.source.token)
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
                        case 'AlreadyInModule':
                            this.setState({
                                moduleError: 'The location is already in that module!'
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
            content = <Updated entityName="Area's Module"></Updated>
            new Promise(resolve => setTimeout(resolve, 1500)).then(res => {
                this.resetUpdatedState();
                this.props.close();
            });
        } else {
            content = (
                <div className="add-module-container">
                    <h1 className="title">
                        Update Module
                    </h1>
                    <form onSubmit={this.updateAreasModule}>
                        <p className="menu-label">Current Module - <span>{this.props.area && this.props.area.moduleName.length !== 0 ? this.props.area.moduleName : 'None'}</span></p>
                        <div className={"modules-container" + (this.state.moduleError.length > 0 ? ' is-danger' : '')}>
                            <ModuleSelector
                                projectId={this.props.projectId}
                                onModuleFilter={this.moduleSelected}
                                selectedModule={this.state.selectedModule}
                                clearModuleSelected={this.clearModuleSelected}>
                            </ModuleSelector>
                        </div>
                        <p className="help is-danger">
                            {this.state.moduleError}
                        </p>
                        <br />
                        {this.state.selectedModule !== null && <p className="menu-label">New Module - {this.state.selectedModule.name}</p>}
                        <button type="submit" className="button is-link">Submit</button>
                    </form>
                </div>
            )
        }
        return (
            <div className="add-area-container border rounded">
                <div className="close-button-container"><i className="fas fa-times close-button" onClick={this.props.close}></i></div>
                {content}
            </div>
        )
    }
}

export default UpdateAreasModule;
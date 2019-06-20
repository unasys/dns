import React, { Component } from "react";
import './styles/AddTag.scss';
import axios from 'axios';
import Updated from "../../../visuals/user-feedback/Updated";
import { updateCriticality } from "../../../../api/Tags";
import CriticalitySelector from "../panels/selectors/CriticalitySelector";

const CancelToken = axios.CancelToken;

class UpdateTagCriticality extends Component {

    constructor(props) {
        super(props);
        this.source = CancelToken.source();
        this.state = {
            updated: false,
            selectedCriticality: null,
            criticalityError: ''
        }
        this.clientSideValidation = this.clientSideValidation.bind(this);
        this.updateTagsCriticality = this.updateTagsCriticality.bind(this);
        this.criticalitySelected = this.criticalitySelected.bind(this);
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
        if (this.state.selectedCriticality === null) {
            this.setState({
                criticalityError: 'Criticality is required!'
            })
            passed = false;
        }
        return passed;
    }

    criticalitySelected(criticality) {
        this.setState({
            selectedCriticality: criticality,
            criticalityError: ''
        })
    }

    clearCriticalitySelected() {
        this.setState({
            selectedCriticality: null,
            criticalityError: ''
        })
    }

    resetUpdatedState() {
        this.setState({
            updated: false
        })
    }

    updateTagsCriticality(e) {
        e.preventDefault();
        e.target.className += ' was-validated';

        if (!this.clientSideValidation()) {
            return;
        }

        let body = {
            criticality: this.state.selectedCriticality.name
        }

        updateCriticality(this.props.projectId, this.props.tag.id, body, this.source.token)
            .then(payload => {
                // Server side validation.
                if (payload.status === 201) {
                    // success 
                    this.setState({
                        updated: true
                    })
                } else {
                    //error
                    switch (payload) {
                        case 'CriticalityAlreadyAssigned':
                            this.setState({
                                subsystemError: 'The tag already has that criticality!'
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
            content = <Updated entityName="Tag's Criticality"></Updated>
            new Promise(resolve => setTimeout(resolve, 1500)).then(res => {
                this.resetUpdatedState();
                this.props.close();
            });
        } else {
            content = (
                <div className="add-tag-container">
                    <h1 className="title">
                        Update Tag - Criticality
                    </h1>
                    <form onSubmit={this.updateTagsCriticality}>
                        <p className="menu-label">Current criticality - <span>{this.props.tag.criticality && this.props.tag.criticality.length !== 0 ? this.props.tag.criticality : 'None'}</span></p>
                        <div className={(this.state.criticalityError.length > 0 ? ' is-danger' : '')}>
                            <CriticalitySelector
                                projectId={this.props.projectId}
                                onCriticalSelect={this.criticalitySelected}
                                selectedCriticality={this.state.selectedCriticality}>
                            </CriticalitySelector>
                        </div>
                        <p className="help is-danger">
                            {this.state.criticalityError}
                        </p>
                        <br />
                        {this.state.selectedCriticality !== null && <p className="menu-label">New Criticality - {this.state.selectedCriticality.name}</p>}
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

export default UpdateTagCriticality;
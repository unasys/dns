import React, { Component } from "react";
import './styles/AddTag.scss';
import axios from 'axios';
import Updated from "../../../visuals/user-feedback/Updated";
import { updateCondition } from "../../../../api/Tags";
import ConditionSelector from "../panels/selectors/ConditionSelector";

const CancelToken = axios.CancelToken;

class UpdateTagCondition extends Component {

    constructor(props) {
        super(props);
        this.source = CancelToken.source();
        this.state = {
            updated: false,
            selectedCondition: null,
            conditionError: ''
        }
        this.clientSideValidation = this.clientSideValidation.bind(this);
        this.updateTagsCondition = this.updateTagsCondition.bind(this);
        this.conditionSelected = this.conditionSelected.bind(this);
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
        if (this.state.selectedCondition === null) {
            this.setState({
                conditionError: 'Condition is required!'
            })
            passed = false;
        }
        return passed;
    }

    conditionSelected(condition) {
        this.setState({
            selectedCondition: condition,
            conditionError: ''
        })
    }

    clearConditionSelected() {
        this.setState({
            selectedCondition: null,
            conditionError: ''
        })
    }

    resetUpdatedState() {
        this.setState({
            updated: false
        })
    }

    updateTagsCondition(e) {
        e.preventDefault();
        e.target.className += ' was-validated';

        if (!this.clientSideValidation()) {
            return;
        }

        let body = {
            condition: this.state.selectedCondition.name.replace(/\s+/g, '')
        }

        updateCondition(this.props.projectId, this.props.tag.id, body, this.source.token)
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
                        case 'ConditionAlreadyAssigned':
                            this.setState({
                                subsystemError: 'The tag already has that condition!'
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
            content = <Updated entityName="Tag's Condition"></Updated>
            new Promise(resolve => setTimeout(resolve, 1500)).then(res => {
                this.resetUpdatedState();
                this.props.close();
            });
        } else {
            content = (
                <div className="add-tag-container">
                    <h1 className="title">
                        Update Tag - Condition
                    </h1>
                    <form onSubmit={this.updateTagsCondition}>
                        <p className="menu-label">Current condition - <span>{this.props.tag.condition && this.props.tag.condition.length !== 0 ? this.props.tag.condition : 'None'}</span></p>
                        <div className={(this.state.conditionError.length > 0 ? ' is-danger' : '')}>
                            <ConditionSelector
                                projectId={this.props.projectId}
                                onConditionSelect={this.conditionSelected}
                                selectedCondition={this.state.selectedCondition}>
                            </ConditionSelector>
                        </div>
                        <p className="help is-danger">
                            {this.state.conditionError}
                        </p>
                        <br />
                        {this.state.selectedCondition !== null && <p className="menu-label">New Condition - {this.state.selectedCondition.name}</p>}
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

export default UpdateTagCondition;
import React, { Component } from "react";
import './styles/AddDiscipline.scss';
import axios from 'axios';
import Created from "../../../visuals/user-feedback/Created";
import { createNewDiscipline } from "../../../../api/Disciplines";

const CancelToken = axios.CancelToken;

class AddDiscipline extends Component {

    constructor(props) {
        super(props);
        this.source = CancelToken.source();
        this.state = {
            name: '',
            nameError: '',
            created: false
        }
        this.clientSideValidation = this.clientSideValidation.bind(this);
        this.createNewDiscipline = this.createNewDiscipline.bind(this);
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
        return true;
    }

    resetCreatedState() {
        this.setState({
            created: false
        })
    }

    createNewDiscipline(e) {
        e.preventDefault();
        e.target.className += ' was-validated';

        if (!this.clientSideValidation()) {
            return;
        }

        let body = {
            name: this.state.name
        }

        createNewDiscipline(this.props.projectId, body, this.source.token)
            .then(payload => {
                // Server side validation.
                if (payload.status === 201) {
                    // success 
                    this.setState({
                        created: true
                    })
                } else {
                    //error
                    switch (payload.data.Case) {
                        case 'DisciplineNameAlreadyExists':
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
                console.error('something went wrong when fetching creating in equipmenttpye in addequipmenttypes.js', e);
            })
    }

    render() {
        let content;
        if (this.state.created) {
            content = <Created entityName="Discipline"></Created>
            new Promise(resolve => setTimeout(resolve, 1500)).then(res => {
                this.resetCreatedState();
            });
        } else {
            content = (
                <div className="add-discipline-container">
                    <h1 className="title">
                        Create Discipline Type
                    </h1>
                    <form onSubmit={this.createNewDiscipline}>
                        <div className="field">
                            <label className="label">Name</label>
                            <div className="control">
                                <input type="text" name="name" onBlur={e => this.onChange(e)} className={"input" + (this.state.nameError.length > 0 ? ' is-danger' : '')} placeholder="Enter Name" required />
                                <p className="help is-danger">
                                    {this.state.nameError}
                                </p>
                            </div>
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

export default AddDiscipline;
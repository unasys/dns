import React, { Component } from "react";
import './styles/AddProductionUnitTypes.scss';
import axios from 'axios';
import Created from "../../../visuals/user-feedback/Created";
import { createNewProductionUnitType } from "../../../../api/ProductionUnitTypes";

const CancelToken = axios.CancelToken;

class AddProductionUnitType extends Component {

    constructor(props) {
        super(props);
        this.source = CancelToken.source();
        this.state = {
            name: '',
            nameError: '',
            created: false
        }
        this.createNewProductionUnitType = this.createNewProductionUnitType.bind(this);
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

    createNewProductionUnitType(e) {
        e.preventDefault();
        e.target.className += ' was-validated';

        if (!this.clientSideValidation()) {
            return;
        }

        let body = {
            name: this.state.name
        }
        createNewProductionUnitType(this.props.projectId, body, this.source.token)
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
                        case 'ProductionUnitTypeNameAlreadyExists':
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
                console.error('something went wrong when fetching installations in addproductionunittype.js', e);
            })
    }

    render() {
        let content;
        if (this.state.created) {
            content = <Created entityName="Production Unit Type"></Created>
            new Promise(resolve => setTimeout(resolve, 1500)).then(res => {
                this.resetCreatedState();
            });
        } else {
            content = (
                <div className="add-production-unit-type-container">
                    <h1 className="title">
                        Create Production Unit Type
                    </h1>
                    <form onSubmit={this.createNewProductionUnitType}>
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
                </div>
            )
        }
        return (
            <div className="add-production-unit-type-container border rounded" >
                <div className="close-button-container"><i className="fas fa-times close-button" onClick={this.props.close}></i></div>
                {content}
            </div>
        )
    }
}

export default AddProductionUnitType;
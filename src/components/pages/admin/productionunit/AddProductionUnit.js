import React, { Component } from "react";
import './styles/AddProductionUnit.scss';
import { createNewProductionUnitCall } from "../../../../api/ProductionUnits";
import axios from 'axios';
import Created from "../../../visuals/user-feedback/Created";
import ProductionUnitTypeSelector from "../panels/selectors/ProductionUnitTypeSelector";

const CancelToken = axios.CancelToken;

class AddProductionUnit extends Component {

    constructor(props) {
        super(props);
        this.source = CancelToken.source();
        this.state = {
            name: '',
            nameError: '',
            detail: '',
            detailError: '',
            created: false,
            PUTypeSelected: null,
            PUTypeError: ''

        }
        this.createNewProductionUnit = this.createNewProductionUnit.bind(this);
        this.productionUnitTypeSelected = this.productionUnitTypeSelected.bind(this);
    }

    componentWillUnmount() {
        this.source.cancel()
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value, [`${e.target.name}Error`]: '' })
    }

    productionUnitTypeSelected(PUType) {
        this.setState({
            PUTypeSelected: PUType,
            PUTypeError: ''
        })
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

        if (this.state.PUTypeSelected === null) {
            this.setState({
                PUTypeError: 'Production Unit Type is required!'
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

    createNewProductionUnit(e) {
        e.preventDefault();
        e.target.className += ' was-validated';

        if (!this.clientSideValidation()) {
            return;
        }

        let body = {
            name: this.state.name,
            detail: this.state.detail,
            productionUnitTypeId: this.state.PUTypeSelected.id
        }

        if (this.state.statusSelected) {
            body.status = this.state.statusSelected.id
        }
        createNewProductionUnitCall(this.props.projectId, body, this.source.token)
            .then(payload => {
                // Server side validation.
                if (payload.status === 201) {
                    // success 
                    this.setState({
                        created: true,
                        PUTypeSelected: null
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
            content = <Created entityName="Production Unit"></Created>
            new Promise(resolve => setTimeout(resolve, 1500)).then(res => {
                this.resetCreatedState();
            });
        } else {
            content = (
                <div className="add-production-unit-container">
                    <h1 className="title">
                        Create Production Unit
                    </h1>
                    <form onSubmit={this.createNewProductionUnit}>
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
                            <input type="text" name="detail" onBlur={e => this.onChange(e)} className="input" placeholder="Detail" required />
                        </div>
                        <label className="label">Production Unit Type</label>
                        <p className="menu-label">{"Selected Production Unit Type - " + (this.state.PUTypeSelected ? this.state.PUTypeSelected.name : "")}</p>
                        <div className="control">
                            <ProductionUnitTypeSelector
                                projectId={this.props.projectId}
                                onProductionUnitTypeSelect={this.productionUnitTypeSelected}
                                selectedProductionUnitType={this.state.PUTypeSelected}>
                            </ProductionUnitTypeSelector>
                            <p className="help is-danger">
                                {this.state.PUTypeError}
                            </p>
                        </div>
                        <button type="submit" className="button is-link">Submit</button>
                    </form>
                </div>
            )
        }
        return (
            <div className="add-production-unit-container border rounded" >
                <div className="close-button-container"><i className="fas fa-times close-button" onClick={this.props.close}></i></div>
                {content}
            </div>
        )
    }
}

export default AddProductionUnit;
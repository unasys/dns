import React, { Component } from "react";
import './styles/AddProductionUnit.scss';
import axios from 'axios';
import Updated from "../../../visuals/user-feedback/Updated";
import { updateProductionUnitsType } from "../../../../api/ProductionUnits";
import ProductionUnitTypeSelector from "../panels/selectors/ProductionUnitTypeSelector";

const CancelToken = axios.CancelToken;

class UpdateProductionUnitsType extends Component {

    constructor(props) {
        super(props);
        this.source = CancelToken.source();
        this.state = {
            updated: false,
            selectedPUType: null,
            PUTypeError: ''
        }
        this.clientSideValidation = this.clientSideValidation.bind(this);
        this.updateProductionUnitsType = this.updateProductionUnitsType.bind(this);
        this.PUTypeSelected = this.PUTypeSelected.bind(this);
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
        if (this.state.selectedPUType === null) {
            this.setState({
                PUTypeError: 'Production Unit Type is required!'
            })
            passed = false;
        }
        return passed;
    }

    PUTypeSelected(puType) {
        this.setState({
            selectedPUType: puType,
            PUTypeError: ''
        })
    }

    clearPUTypeSelected() {
        this.setState({
            selectedPUType: null,
            PUTypeError: ''
        })
    }

    resetUpdatedState() {
        this.setState({
            updated: false
        })
    }

    updateProductionUnitsType(e) {
        e.preventDefault();
        e.target.className += ' was-validated';

        if (!this.clientSideValidation()) {
            return;
        }

        let body = {
            productionUnitTypeId: this.state.selectedPUType.id
        }

        updateProductionUnitsType(this.props.projectId, this.props.productionUnit.id, body, this.source.token)
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
                        case '':
                            this.setState({
                                PUTypeError: 'The Production Unit already has that Type!'
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
            content = <Updated entityName="Production Unit's Type"></Updated>
            new Promise(resolve => setTimeout(resolve, 1500)).then(res => {
                this.resetUpdatedState();
                this.props.close();
            });
        } else {
            content = (
                <div className="add-production-unit-container">
                    <h1 className="title">
                        Update Production Unit - Type
                    </h1>
                    <form onSubmit={this.updateProductionUnitsType}>
                        <p className="menu-label">Current Production Unit Type - <span>{this.props.productionUnit.productionUnitTypeName && this.props.productionUnit.productionUnitTypeName.length !== 0 ? this.props.productionUnit.productionUnitTypeName : 'None'}</span></p>
                        <div className={(this.state.PUTypeError.length > 0 ? ' is-danger' : '')}>
                            <ProductionUnitTypeSelector
                                projectId={this.props.projectId}
                                onProductionUnitTypeSelect={this.PUTypeSelected}
                                selectedProductionUnitType={this.state.selectedPUType}>
                            </ProductionUnitTypeSelector>
                        </div>
                        <p className="help is-danger">
                            {this.state.PUTypeError}
                        </p>
                        <br />
                        {this.state.selectedPUType !== null && <p className="menu-label">New Production Unit Type - {this.state.selectedPUType.name}</p>}
                        <button type="submit" className="button is-link">Submit</button>
                    </form>
                </div>
            )
        }
        return (
            <div className="add-production-unit-container border rounded">
                <div className="close-button-container"><i className="fas fa-times close-button" onClick={this.props.close}></i></div>
                {content}
            </div>
        )
    }
}

export default UpdateProductionUnitsType;
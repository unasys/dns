import React, { Component } from "react";
import './styles/AddSystem.scss';
import axios from 'axios';
import Updated from "../../../visuals/user-feedback/Updated";
import { updateSystemProductionUnit } from "../../../../api/Systems";
import ProductionUnitSelector from "../panels/selectors/ProductionUnitSelector";

const CancelToken = axios.CancelToken;

class UpdateSystemProductionUnit extends Component {

    constructor(props) {
        super(props);
        this.source = CancelToken.source();
        this.state = {
            updated: false,
            selectedPU: null,
            selectedPUError: ''
        }
        this.clientSideValidation = this.clientSideValidation.bind(this);
        this.updateSystemProductionUnit = this.updateSystemProductionUnit.bind(this);
        this.clearSelectedPU = this.clearSelectedPU.bind(this);
        this.PUSelected = this.PUSelected.bind(this);
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
        if (this.state.selectedPU === null) {
            this.setState({
                selectedPUError: 'Production Unit is required!'
            })
            passed = false;
        }
        return passed;
    }

    PUSelected(PU) {
        this.setState({
            selectedPU: PU,
            selectedPUError: ''
        })
    }

    clearSelectedPU() {
        this.setState({
            selectedPU: null,
            selectedPUError: ''
        })
    }

    resetUpdatedState() {
        this.setState({
            updated: false
        })
    }

    updateSystemProductionUnit(e) {
        e.preventDefault();
        e.target.className += ' was-validated';

        if (!this.clientSideValidation()) {
            return;
        }

        let body = {
            productionUnitId: this.state.selectedPU.id
        }

        updateSystemProductionUnit(this.props.projectId, this.props.system.id, body, this.source.token)
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
                        case 'ProductionUnitAlreadyAssigned':
                            this.setState({
                                selectedPUError: 'The system already has that Production Unit!'
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
            content = <Updated entityName="System's Production Unit"></Updated>
            new Promise(resolve => setTimeout(resolve, 1500)).then(res => {
                this.resetUpdatedState();
                this.props.close();
            });
        } else {
            content = (
                <div className="add-system-container">
                    <h1 className="title">
                        Update system - Production Unit
                    </h1>
                    <form onSubmit={this.updateSystemProductionUnit}>
                        <p className="menu-label">Current Production Unit - <span>{this.props.system.productionUnitName && this.props.system.productionUnitName.length !== 0 ? this.props.system.productionUnitName : 'None'}</span></p>
                        <div className={(this.state.selectedPUError.length > 0 ? ' is-danger' : '')}>
                            <ProductionUnitSelector
                                projectId={this.props.projectId}
                                onProductionUnitSelect={this.PUSelected}
                                selectedProductionUnit={this.state.selectedPU}
                                clearProductionUnitSelected={this.clearSelectedPU}>
                            </ProductionUnitSelector>
                        </div>
                        <p className="help is-danger">
                            {this.state.selectedPUError}
                        </p>
                        <br />
                        {this.state.selectedPU !== null && <p className="menu-label">New Production Unit - {this.state.selectedPU.name}</p>}
                        <button type="submit" className="button is-link">Submit</button>
                    </form>
                </div>
            )
        }
        return (
            <div className="add-system-container border rounded">
                <div className="close-button-container"><i className="fas fa-times close-button" onClick={this.props.close}></i></div>
                {content}
            </div>
        )
    }
}

export default UpdateSystemProductionUnit;
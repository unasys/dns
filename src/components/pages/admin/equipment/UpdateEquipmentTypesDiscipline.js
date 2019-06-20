import React, { Component } from "react";
import './styles/AddEquipmentType.scss';
import axios from 'axios';
import Updated from "../../../visuals/user-feedback/Updated";
import { moveEquipmentTypesDiscipline } from "../../../../api/EquipmentTypes";
import DisciplineSelector from "../panels/selectors/DisciplineSelector";

const CancelToken = axios.CancelToken;

class UpdateEquipmentTypesDiscipline extends Component {

    constructor(props) {
        super(props);
        this.source = CancelToken.source();
        this.state = {
            updated: false,
            selectedDiscipline: null,
            disciplineError: ''
        }
        this.clearDisciplineSelected = this.clearDisciplineSelected.bind(this);
        this.clientSideValidation = this.clientSideValidation.bind(this);
        this.updateEquipmentTypesDiscipline = this.updateEquipmentTypesDiscipline.bind(this);
        this.disciplineSelected = this.disciplineSelected.bind(this);
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
        if (this.state.selectedDiscipline === null) {
            this.setState({
                disciplineError: 'Discipline is required!'
            })
            passed = false;
        }
        return passed;
    }

    disciplineSelected(area) {
        this.setState({
            selectedDiscipline: area,
            disciplineError: ''
        })
    }

    clearDisciplineSelected() {
        this.setState({
            selectedDiscipline: null,
            disciplineError: ''
        })
    }

    resetUpdatedState() {
        this.setState({
            updated: false
        })
    }

    updateEquipmentTypesDiscipline(e) {
        e.preventDefault();
        e.target.className += ' was-validated';

        if (!this.clientSideValidation()) {
            return;
        }

        let body = {
            DisciplineId: this.state.selectedDiscipline.id
        }

        moveEquipmentTypesDiscipline(this.props.projectId, this.props.equipmentType.id, body, this.source.token)
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
                        case 'AlreadyInDiscipline':
                            this.setState({
                                disciplineError: 'The Equipment Type is already in that discipline!'
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
            content = <Updated entityName="Equipment Types's Discipline"></Updated>
            new Promise(resolve => setTimeout(resolve, 1500)).then(res => {
                this.resetUpdatedState();
                this.props.close();
            });
        } else {
            content = (
                <div className="add-module-container">
                    <h1 className="title">
                        Update Equipment Type
                    </h1>
                    <form onSubmit={this.updateEquipmentTypesDiscipline}>
                        <p className="menu-label">Current Discipline - <span>{this.props.equipmentType && this.props.equipmentType.disciplineName.length !== 0 ? this.props.equipmentType.disciplineName : 'None'}</span></p>
                        <div className={"disciplines-container" + (this.state.disciplineError.length > 0 ? ' is-danger' : '')}>
                            <DisciplineSelector
                                projectId={this.props.projectId}
                                onDisciplineFilter={this.disciplineSelected}
                                selectedDiscipline={this.state.selectedDiscipline}
                                clearDisciplineSelected={this.clearDisciplineSelected}>
                            </DisciplineSelector>
                        </div>
                        <p className="help is-danger">
                            {this.state.disciplineError}
                        </p>
                        <br />
                        {this.state.selectedDiscipline !== null && <p className="menu-label">New Discipline - {this.state.selectedDiscipline.name}</p>}
                        <button type="submit" className="button is-link">Submit</button>
                    </form>
                </div>
            )
        }
        return (
            <div className="add-equipment-type-container border rounded">
                <div className="close-button-container"><i className="fas fa-times close-button" onClick={this.props.close}></i></div>
                {content}
            </div>
        )
    }
}

export default UpdateEquipmentTypesDiscipline;
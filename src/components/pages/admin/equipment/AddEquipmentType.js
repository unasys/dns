import React, { Component } from "react";
import './styles/AddEquipmentType.scss';
import axios from 'axios';
import Created from "../../../visuals/user-feedback/Created";
import { createNewEquipmentType } from "../../../../api/EquipmentTypes";
import DisciplineSelector from "../panels/selectors/DisciplineSelector";

const CancelToken = axios.CancelToken;

class AddEquipmentType extends Component {

    constructor(props) {
        super(props);
        this.source = CancelToken.source();
        this.state = {
            name: '',
            nameError: '',
            detail: '',
            detailError: '',
            disciplineSelected: null,
            created: false
        }
        this.createNewEquipmentType = this.createNewEquipmentType.bind(this);
        this.clearDisciplineSelected = this.clearDisciplineSelected.bind(this);
        this.onDisciplineFilter = this.onDisciplineFilter.bind(this);
    }

    clearDisciplineSelected() {
        this.setState({
            disciplineSelected: null
        })
    }

    onDisciplineFilter(discipline) {
        this.setState({
            disciplineSelected: discipline
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
        return true;
    }

    resetCreatedState() {
        this.setState({
            created: false
        })
    }

    createNewEquipmentType(e) {
        e.preventDefault();
        e.target.className += ' was-validated';

        if (!this.clientSideValidation()) {
            return;
        }


        let body = {
            name: this.state.name
        }

        if (this.state.disciplineSelected) {
            body.disciplineId = this.state.disciplineSelected.id
        }

        createNewEquipmentType(this.props.projectId, body, this.source.token)
            .then(payload => {
                // Server side validation.
                if (payload.status === 201) {
                    // success 
                    this.setState({
                        created: true,
                        disciplineSelected: null
                    })
                } else {
                    //error
                    switch (payload.data.Case) {
                        case 'EquipmentTypeNameAlreadyExists':
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
            content = <Created entityName="Equipment Type"></Created>
            new Promise(resolve => setTimeout(resolve, 1500)).then(res => {
                this.resetCreatedState();
            });
        } else {
            content = (
                <div className="add-equipment-type-container">
                    <h1 className="title">
                        Create Equipment Type
                    </h1>
                    <form onSubmit={this.createNewEquipmentType}>
                        <div className="field">
                            <label className="label">Name</label>
                            <div className="control">
                                <input type="text" name="name" onBlur={e => this.onChange(e)} className={"input" + (this.state.nameError.length > 0 ? ' is-danger' : '')} placeholder="Enter Name" required />
                                <p className="help is-danger">
                                    {this.state.nameError}
                                </p>
                            </div>
                        </div>

                        <label className="label">Discipline</label>
                        <p className="menu-label">{"Selected Discipline - " + (this.state.disciplineSelected ? this.state.disciplineSelected.name : "")}</p>
                        <div className={"disciplines-container"}>
                            <DisciplineSelector
                                projectId={this.props.projectId}
                                onDisciplineFilter={this.onDisciplineFilter}
                                selectedDiscipline={this.state.disciplineSelected}
                                clearDisciplineSelected={this.clearDisciplineSelected}>
                            </DisciplineSelector>
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

export default AddEquipmentType;
import React, { Component } from 'react';
import axios from 'axios';
import DotSpinner from '../../../../visuals/loading/DotSpinner';
import { fetchEquipmentTypes } from '../../../../../api/EquipmentTypes';

const CancelToken = axios.CancelToken;

class EquipmentTypeSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            equipmentTypes: [],
            isLoading: true,
            searchPhrase: ''
        }
        this.source = CancelToken.source();
        this.filterEquipmentTypes = this.filterEquipmentTypes.bind(this);
        this.updateSearchPhrase = this.updateSearchPhrase.bind(this);
    }

    componentDidMount() {
        this.fetchEquipmentTypes(this.props.projectId);
    }

    componentWillUnmount() {
        this.source.cancel()
    }

    fetchEquipmentTypes(projectId) {
        fetchEquipmentTypes(projectId, this.source.token)
            .then(payload => {
                this.setState({
                    equipmentTypes: payload.data._embedded.items,
                    isLoading: false
                });
                return payload;
            })
            .catch((e) => {
                if (!axios.isCancel(e)) {
                    console.error('something went wrong when fetching facilities in adminfilter facilitiesselector.js', e);
                }
            })
    }

    updateSearchPhrase(evt) {
        this.setState({
            searchPhrase: evt.target.value
        })
    }

    filterEquipmentTypes(equipmentTypes, searchPhrase) {
        let searchPhraseUpper = searchPhrase.toUpperCase();
        return equipmentTypes.filter(equipmentType => {
            return equipmentType.name.toUpperCase().includes(searchPhraseUpper)
        })
    }

    render() {
        let searchBar = (
            <div className="search-bar-container">
                <div className="field">
                    <div className="control">
                        <input value={this.state.searchPhrase} onChange={evt => this.updateSearchPhrase(evt)} className="input" type="text" placeholder="Search" />
                    </div>
                </div>
            </div>)

        let filteredEquipmentTypes;
        if (this.state.searchPhrase !== null && this.state.searchPhrase !== '') {
            filteredEquipmentTypes = this.filterEquipmentTypes(this.state.equipmentTypes, this.state.searchPhrase);
        } else {
            filteredEquipmentTypes = this.state.equipmentTypes;
        }

        let equipmentTypes = (
            filteredEquipmentTypes.map(equipmentType => {
                return (
                    <ul className="menu-list" key={equipmentType.name}>
                        <li className={this.props.selectedEquipmentType === equipmentType ? 'selected' : ''}
                            onClick={this.props.onEquipmentTypeFilter.bind(this, equipmentType)}> {/** extract to subcomponent */}
                            <a href='# '>{equipmentType.name}
                                {this.props.selectedEquipmentType === equipmentType && <i className="fas fa-times close-button" onClick={(e) => {
                                    e.stopPropagation();
                                    this.props.clearEquipmentTypeSelected();
                                }
                                }>
                                </i>}
                            </a>
                        </li>
                    </ul>)
            }))

        return (
            <div>
                {searchBar}
                {this.state.isLoading ? <DotSpinner size={49}></DotSpinner> :
                    (filteredEquipmentTypes.length === 0) ? <div>No results.</div> :
                        <div className="equipmentTypes-list-container">
                            {equipmentTypes}
                        </div>}
            </div>);
    }
}

export default EquipmentTypeSelector;
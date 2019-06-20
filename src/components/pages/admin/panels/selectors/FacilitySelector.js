import React, { Component } from 'react';
import axios from 'axios';
import DotSpinner from '../../../../visuals/loading/DotSpinner';
import { fetchFacilities } from '../../../../../api/Facilities';

const CancelToken = axios.CancelToken;

class FacilitySelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            facilities: [],
            isLoading: true,
            searchPhrase: ''
        }
        this.source = CancelToken.source();
        this.filterFacilities = this.filterFacilities.bind(this);
        this.updateSearchPhrase = this.updateSearchPhrase.bind(this);
    }

    componentDidMount() {
        this.fetchFacilities(this.props.projectId);
    }

    componentWillUnmount() {
        this.source.cancel()
    }

    fetchFacilities(projectId) {
        fetchFacilities(projectId, this.source.token)
            .then(payload => {
                this.setState({
                    facilities: payload.data._embedded.items,
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

    filterFacilities(facilities, searchPhrase) {
        let searchPhraseUpper = searchPhrase.toUpperCase();
        return facilities.filter(facility => {
            return facility.name.toUpperCase().includes(searchPhraseUpper)
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

        let filteredFacilities;
        if (this.state.searchPhrase !== null && this.state.searchPhrase !== '') {
            filteredFacilities = this.filterFacilities(this.state.facilities, this.state.searchPhrase);
        } else {
            filteredFacilities = this.state.facilities;
        }

        let facilities = (
            filteredFacilities.map(facility => {
                return (
                    <ul className="menu-list" key={facility.name}>
                        <li className={this.props.selectedFacility === facility ? 'selected' : ''}
                            onClick={this.props.onFacilityFilter.bind(this, facility)}> {/** extract to subcomponent */}
                            <a href='# '>{facility.name}
                                {this.props.selectedFacility === facility && <i className="fas fa-times close-button" onClick={(e) => {
                                    e.stopPropagation();
                                    this.props.clearFacilitySelected();
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
                    (filteredFacilities.length === 0) ? <div>No results.</div> :
                        <div className="facility-list-container">
                            {facilities}
                        </div>}
            </div>);
    }
}

export default FacilitySelector;
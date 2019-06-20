import React, { Component } from 'react';
import axios from 'axios';
import DotSpinner from '../../../../visuals/loading/DotSpinner';
import { fetchDisciplines } from '../../../../../api/Disciplines';

const CancelToken = axios.CancelToken;

class DisciplineSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            disciplines: [],
            isLoading: true,
            searchPhrase: ''
        }
        this.source = CancelToken.source();
        this.filterDisciplines = this.filterDisciplines.bind(this);
        this.updateSearchPhrase = this.updateSearchPhrase.bind(this);
    }

    componentDidMount() {
        this.fetchDisciplines(this.props.projectId);
    }

    componentWillUnmount() {
        this.source.cancel()
    }

    fetchDisciplines(projectId) {
        fetchDisciplines(projectId, this.source.token)
            .then(payload => {
                this.setState({
                    disciplines: payload.data._embedded.items,
                    isLoading: false
                });
                return payload;
            })
            .catch((e) => {
                if (!axios.isCancel(e)) {
                    console.error('something went wrong when fetching disciplines in adminfilter facilitiesselector.js', e);
                }
            })
    }

    updateSearchPhrase(evt) {
        this.setState({
            searchPhrase: evt.target.value
        })
    }

    filterDisciplines(disciplines, searchPhrase) {
        let searchPhraseUpper = searchPhrase.toUpperCase();
        return disciplines.filter(discipline => {
            return discipline.name.toUpperCase().includes(searchPhraseUpper)
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

        let filteredDisciplines;
        if (this.state.searchPhrase !== null && this.state.searchPhrase !== '') {
            filteredDisciplines = this.filterDisciplines(this.state.disciplines, this.state.searchPhrase);
        } else {
            filteredDisciplines = this.state.disciplines;
        }

        let disciplines = (
            filteredDisciplines.map(discipline => {
                return (
                    <ul className="menu-list" key={discipline.name}>
                        <li className={this.props.selectedDiscipline === discipline ? 'selected' : ''}
                            onClick={this.props.onDisciplineFilter.bind(this, discipline)}> {/** extract to subcomponent */}
                            <a href='# '>{discipline.name}
                                {this.props.selectedDiscipline === discipline && <i className="fas fa-times close-button" onClick={(e) => {
                                    e.stopPropagation();
                                    this.props.clearDisciplineSelected();
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
                    (filteredDisciplines.length === 0) ? <div>No results.</div> :
                        <div className="discipline-list-container">
                            {disciplines}
                        </div>}
            </div>);
    }
}

export default DisciplineSelector;
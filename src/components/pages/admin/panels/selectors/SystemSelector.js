import React, { Component } from 'react';
import { fetchSystemsCall } from '../../../../../api/Systems';
import axios from 'axios';
import DotSpinner from '../../../../visuals/loading/DotSpinner';

const CancelToken = axios.CancelToken;

class SystemSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            systems: [],
            isLoading: true,
            searchPhrase: ''
        }
        this.source = CancelToken.source();
    }

    componentDidMount() {
        this.fetchSystems(this.props.projectId);
    }

    componentWillUnmount() {
        this.source.cancel()
    }

    fetchSystems(projectId) {
        fetchSystemsCall(projectId, this.source.token)
            .then(payload => {
                this.setState({
                    systems: payload.data._embedded.items,
                    isLoading: false
                });
                return payload;
            })
            .catch((e) => {
                if (!axios.isCancel(e)) {
                    console.error('something went wrong when fetching systems in adminfilter systemsselector.js', e);
                }
            })
    }

    updateSearchPhrase(evt) {
        this.setState({
            searchPhrase: evt.target.value
        })
    }

    filterSystems(systems, searchPhrase) {
        let searchPhraseUpper = searchPhrase.toUpperCase();
        return systems.filter(system => {
            return system.name.toUpperCase().includes(searchPhraseUpper) || system.detail.toUpperCase().includes(searchPhraseUpper)
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

        let filteredSystems;
        if (this.state.searchPhrase !== null && this.state.searchPhrase !== '') {
            filteredSystems = this.filterSystems(this.state.systems, this.state.searchPhrase);
        } else {
            filteredSystems = this.state.systems;
        }

        let systems = (
            filteredSystems.map(system => {
                return (
                    <ul className="menu-list" key={system.name}>
                        <li className={this.props.selectedSystem === system ? 'selected' : ''}
                            onClick={this.props.onSystemFilter.bind(this, system)}> {/** extract to subcomponent */}
                            <a href='# '>{system.name + " - " + system.detail}
                                {this.props.selectedSystem === system && <i className="fas fa-times close-button" onClick={(e) => {
                                    e.stopPropagation();
                                    this.props.clearSystemSelected();
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
                    (filteredSystems.length === 0) ? <div>No results.</div> :
                        <div className="system-list-container">
                            {systems}
                        </div>}
            </div>);
    }
}

export default SystemSelector;
import React, { Component } from 'react';
import axios from 'axios';
import DotSpinner from '../../../../visuals/loading/DotSpinner';
import { fetchSubsystemsCall } from '../../../../../api/Subsystems';

const CancelToken = axios.CancelToken;

class SubsystemSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subsystems: [],
            isLoading: true,
            searchPhrase: ''
        }
        this.source = CancelToken.source();
    }

    componentDidMount() {
        this.fetchSubsystems(this.props.projectId);
    }

    componentWillUnmount() {
        this.source.cancel()
    }

    fetchSubsystems(projectId) {
        fetchSubsystemsCall(projectId, this.source.token)
            .then(payload => {
                this.setState({
                    subsystems: payload.data._embedded.items,
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

    filterSubsystems(subsystems, searchPhrase) {
        let searchPhraseUpper = searchPhrase.toUpperCase();
        return subsystems.filter(subsystem => {
            return subsystem.name.toUpperCase().includes(searchPhraseUpper) || subsystem.detail.toUpperCase().includes(searchPhraseUpper)
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

        let filteredSubsystems;
        if (this.state.searchPhrase !== null && this.state.searchPhrase !== '') {
            filteredSubsystems = this.filterSubsystems(this.state.subsystems, this.state.searchPhrase);
        } else {
            filteredSubsystems = this.state.subsystems;
        }

        let subsystems = (
            filteredSubsystems.map(subsystem => {
                return (
                    <ul className="menu-list" key={subsystem.name}>
                        <li className={this.props.selectedSubsystem === subsystem ? 'selected' : ''}
                            onClick={this.props.onSubsystemFilter.bind(this, subsystem)}> {/** extract to subcomponent */}
                            <a href='# '>{subsystem.name + " - " + subsystem.detail}
                                {this.props.selectedSubsystem === subsystem && <i className="fas fa-times close-button" onClick={(e) => {
                                    e.stopPropagation();
                                    this.props.clearSubsystemSelected();
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
                    (filteredSubsystems.length === 0) ? <div>No results.</div> :
                        <div className="subsystem-list-container">
                            {subsystems}
                        </div>}
            </div>);
    }
}

export default SubsystemSelector;
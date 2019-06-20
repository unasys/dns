import React, { Component } from 'react';
import axios from 'axios';
import DotSpinner from '../../../../visuals/loading/DotSpinner';
import { fetchModules } from '../../../../../api/Modules';

const CancelToken = axios.CancelToken;

class ModuleSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modules: [],
            isLoading: true,
            searchPhrase: ''
        }
        this.source = CancelToken.source();
        this.filterModules = this.filterModules.bind(this);
        this.updateSearchPhrase = this.updateSearchPhrase.bind(this);
    }

    componentDidMount() {
        this.fetchModules(this.props.projectId);
    }

    componentWillUnmount() {
        this.source.cancel()
    }

    fetchModules(projectId) {
        fetchModules(projectId, this.source.token)
            .then(payload => {
                this.setState({
                    modules: payload.data._embedded.items,
                    isLoading: false
                });
                return payload;
            })
            .catch((e) => {
                if (!axios.isCancel(e)) {
                    console.error('something went wrong when fetching modules in adminfilter modulesselector.js', e);
                }
            })
    }

    updateSearchPhrase(evt) {
        this.setState({
            searchPhrase: evt.target.value
        })
    }

    filterModules(modules, searchPhrase) {
        let searchPhraseUpper = searchPhrase.toUpperCase();
        return modules.filter(moduleObject => {
            return moduleObject.name.toUpperCase().includes(searchPhraseUpper)
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

        let filteredModules;
        if (this.state.searchPhrase !== null && this.state.searchPhrase !== '') {
            filteredModules = this.filterModules(this.state.modules, this.state.searchPhrase);
        } else {
            filteredModules = this.state.modules;
        }

        let modules = (
            filteredModules.map(moduleObject => {
                return (
                    <ul className="menu-list" key={moduleObject.name}>
                        <li className={this.props.selectedModule === moduleObject ? 'selected' : ''}
                            onClick={this.props.onModuleFilter.bind(this, moduleObject)}> {/** extract to subcomponent */}
                            <a href='# '>{moduleObject.name}
                                {this.props.selectedModule === moduleObject && <i className="fas fa-times close-button" onClick={(e) => {
                                    e.stopPropagation();
                                    this.props.clearModuleSelected();
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
                    (filteredModules.length === 0) ? <div>No results.</div> :
                        <div className="moduleObject-list-container">
                            {modules}
                        </div>}
            </div>);
    }
}

export default ModuleSelector;
import React, { Component } from 'react';
import axios from 'axios';
import DotSpinner from '../../../../visuals/loading/DotSpinner';
import { fetchAreas } from '../../../../../api/Areas';

const CancelToken = axios.CancelToken;

class AreaSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            areas: [],
            isLoading: true,
            searchPhrase: ''
        }
        this.source = CancelToken.source();
        this.filterAreas = this.filterAreas.bind(this);
        this.updateSearchPhrase = this.updateSearchPhrase.bind(this);
    }

    componentDidMount() {
        this.fetchAreas(this.props.projectId);
    }

    componentWillUnmount() {
        this.source.cancel()
    }

    fetchAreas(projectId) {
        fetchAreas(projectId, this.source.token)
            .then(payload => {
                this.setState({
                    areas: payload.data._embedded.items,
                    isLoading: false
                });
                return payload;
            })
            .catch((e) => {
                if (!axios.isCancel(e)) {
                    console.error('something went wrong when fetching areas in adminfilter areasselector.js', e);
                }
            })
    }

    updateSearchPhrase(evt) {
        this.setState({
            searchPhrase: evt.target.value
        })
    }

    filterAreas(areas, searchPhrase) {
        let searchPhraseUpper = searchPhrase.toUpperCase();
        return areas.filter(area => {
            return area.name.toUpperCase().includes(searchPhraseUpper)
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

        let filteredAreas;
        if (this.state.searchPhrase !== null && this.state.searchPhrase !== '') {
            filteredAreas = this.filterAreas(this.state.areas, this.state.searchPhrase);
        } else {
            filteredAreas = this.state.areas;
        }

        let areas = (
            filteredAreas.map(area => {
                return (
                    <ul className="menu-list" key={area.name}>
                        <li className={this.props.selectedArea === area ? 'selected' : ''}
                            onClick={this.props.onAreaFilter.bind(this, area)}> {/** extract to subcomponent */}
                            <a href='# '>{area.name}
                                {this.props.selectedArea === area && <i className="fas fa-times close-button" onClick={(e) => {
                                    e.stopPropagation();
                                    this.props.clearAreaSelected();
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
                    (filteredAreas.length === 0) ? <div>No results.</div> :
                        <div className="area-list-container">
                            {areas}
                        </div>}
            </div>);
    }
}

export default AreaSelector;
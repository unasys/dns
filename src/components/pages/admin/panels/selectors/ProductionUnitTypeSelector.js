import React, { Component } from 'react';
import axios from 'axios';
import DotSpinner from '../../../../visuals/loading/DotSpinner';
import { fetchProductionUnitTypes } from '../../../../../api/ProductionUnitTypes';

const CancelToken = axios.CancelToken;

class ProductionUnitTypeSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            productionUnitTypes: [],
            isLoading: true,
            searchPhrase: ''
        }
        this.source = CancelToken.source();
    }

    componentDidMount() {
        this.fetchProductionUnitTypes(this.props.projectId);
    }

    componentWillUnmount() {
        this.source.cancel()
    }

    fetchProductionUnitTypes(projectId) {
        fetchProductionUnitTypes(projectId, this.source.token)
            .then(payload => {
                this.setState({
                    productionUnitTypes: payload.data._embedded.items,
                    isLoading: false
                });
                return payload;
            })
            .catch((e) => {
                if (!axios.isCancel(e)) {
                    console.error('something went wrong when fetching productionunittypes in adminfilter productiionunitytypeselector.js', e);
                }
            })
    }

    updateSearchPhrase(evt) {
        this.setState({
            searchPhrase: evt.target.value
        })
    }

    filterProductionUnitTypes(productionunittypes, searchPhrase) {
        let searchPhraseUpper = searchPhrase.toUpperCase();
        return productionunittypes.filter(productionUnitType => {
            return productionUnitType.name.toUpperCase().includes(searchPhraseUpper)
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

        let filteredProductionUnitTypes;
        if (this.state.searchPhrase !== null && this.state.searchPhrase !== '') {
            filteredProductionUnitTypes = this.filterProductionUnitTypes(this.state.productionUnitTypes, this.state.searchPhrase);
        } else {
            filteredProductionUnitTypes = this.state.productionUnitTypes;
        }

        let productionUnitTypes = (
            filteredProductionUnitTypes.map(productionUnitType => {
                return (
                    <ul className="menu-list" key={productionUnitType.name}>
                        <li className={this.props.selectedProductionUnitType === productionUnitType ? 'selected' : ''}
                            onClick={this.props.onProductionUnitTypeSelect.bind(this, productionUnitType)}> {/** extract to subcomponent */}
                            <a href='# '>{productionUnitType.name}
                                {this.props.selectedSystem === productionUnitType && <i className="fas fa-times close-button" onClick={(e) => {
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
                    (filteredProductionUnitTypes.length === 0) ? <div>No results.</div> :
                        <div className="production-unit-type-list-container">
                            {productionUnitTypes}
                        </div>}
            </div>);
    }
}

export default ProductionUnitTypeSelector;
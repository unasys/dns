import React, { Component } from 'react';
import axios from 'axios';
import DotSpinner from '../../../../visuals/loading/DotSpinner';
import { fetchProductionUnitsCall } from '../../../../../api/ProductionUnits';

const CancelToken = axios.CancelToken;

class ProductionUnitSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            productionUnits: [],
            isLoading: true,
            searchPhrase: ''
        }
        this.source = CancelToken.source();
    }

    componentDidMount() {
        this.fetchProductionUnits(this.props.projectId);
    }

    componentWillUnmount() {
        this.source.cancel()
    }

    fetchProductionUnits(projectId) {
        fetchProductionUnitsCall(projectId, this.source.token)
            .then(payload => {
                this.setState({
                    productionUnits: payload.data._embedded.items,
                    isLoading: false
                });
                return payload;
            })
            .catch((e) => {
                if (!axios.isCancel(e)) {
                    console.error('something went wrong when fetching productionunit in adminfilter productiionunityselector.js', e);
                }
            })
    }

    updateSearchPhrase(evt) {
        this.setState({
            searchPhrase: evt.target.value
        })
    }

    filterProductionUnits(productionunits, searchPhrase) {
        let searchPhraseUpper = searchPhrase.toUpperCase();
        return productionunits.filter(productionUnit => {
            return productionUnit.name.toUpperCase().includes(searchPhraseUpper)
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

        let filteredProductionUnits;
        if (this.state.searchPhrase !== null && this.state.searchPhrase !== '') {
            filteredProductionUnits = this.filterProductionUnits(this.state.productionUnits, this.state.searchPhrase);
        } else {
            filteredProductionUnits = this.state.productionUnits;
        }

        let productionUnits = (
            filteredProductionUnits.map(productionUnit => {
                return (
                    <ul className="menu-list" key={productionUnit.name}>
                        <li className={this.props.selectedProductionUnit === productionUnit ? 'selected' : ''}
                            onClick={this.props.onProductionUnitSelect.bind(this, productionUnit)}> {/** extract to subcomponent */}
                            <a href='# '>{productionUnit.name}
                                {this.props.selectedProductionUnit === productionUnit && <i className="fas fa-times close-button" onClick={(e) => {
                                    e.stopPropagation();
                                    this.props.clearProductionUnitSelected();
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
                    (filteredProductionUnits.length === 0) ? <div>No results.</div> :
                        <div className="production-unit-list-container">
                            {productionUnits}
                        </div>}
            </div>);
    }
}

export default ProductionUnitSelector;
import React from 'react';
import ResultItem from '../../../../../result-item/ResultItem'
import update from 'immutability-helper';
import axios from 'axios';
import NoResultItem from '../../../../../result-item/NoResultItem';
import { fetchProductionUnitsCall } from '../../../../../../api/ProductionUnits';

const CancelToken = axios.CancelToken;

class ProductionUnitsSelector extends React.Component {

    constructor(props) {
        super(props);
        this.source = CancelToken.source();
        this.state = {
            productionUnits: [],
            isLoading: true
        }
    }

    fetchProductionUnitDocumentCount(projectId, productionUnit, index) {
        axios.get(`/projects/${projectId}/documents?references=${productionUnit.id}&documentTypeId=${this.props.documentType.id}&fetch=1`, {
            cancelToken: this.source.token
        })
            .then(payload => {
                this.setState({
                    productionUnits: update(this.state.productionUnits, { [index]: { count: { $set: payload.data.total } } })
                })
            }).catch((e) => {
                if (!axios.isCancel(e)) {
                    console.error('something went wrong when fetching productionUnit in productionUnitseecktor.js', e);
                }
            })
    }

    fetchProductionUnits(projectId) {
        fetchProductionUnitsCall(projectId, this.source.token)
            .then(payload => {
                this.setState({
                    productionUnits: payload.data._embedded.items,
                    isLoading: false
                });
                return payload;
            }).then(payload => {
                // eslint-disable-next-line
                payload.data._embedded.items.map((productionUnit, i) => {
                    this.fetchProductionUnitDocumentCount(projectId, productionUnit, i);
                })
            })
            .catch((e) => {
                if (!axios.isCancel(e)) {
                    console.error('something went wrong when fetching productionUnit in productionUnitseecktor.js', e);
                }
            })
    }

    componentDidMount() {
        this.fetchProductionUnits(this.props.projectId);
    }

    componentWillUnmount() {
        this.source.cancel();
    }

    render() {
        return (
            (this.state.productionUnits.length === 0 && this.state.isLoading === false) ? <NoResultItem></NoResultItem> :
                this.state.productionUnits.map(productionUnit => {
                    return <ResultItem key={productionUnit.id} content={productionUnit.name} count={productionUnit.count} contentOnClick={this.props.onProductionUnitSelected.bind(this, productionUnit)}></ResultItem>;
                })
        );
    }
}

export default ProductionUnitsSelector;

import React from 'react';
import update from 'immutability-helper';
import axios from 'axios';
import queryString from 'query-string';
import { fetchProductionUnitsCall } from '../../../api/ProductionUnits';

const CancelToken = axios.CancelToken;

class ProductionUnitSelector extends React.Component {

    constructor(props) {
        super(props);
        this.source = CancelToken.source();
        this.state = {
            productionUnits: [],
            isLoading: true
        }
    }

    fetchProductionUnitSystemCount(projectId, urlParams, index) {
        let url = `/projects/${projectId}/systems`
        let urlParamsStr = queryString.stringify(urlParams);

        url += `?${urlParamsStr}&offset=0&fetch=$1`;
        axios.get(url)
            .then(payload => {
                this.setState({
                    productionUnits: update(this.state.productionUnits, { [index]: { systemCount: { $set: payload.data.total } } })
                })
            }).catch((e) => {
                if (!axios.isCancel(e)) {
                    console.error('something went wrong when fetching documentTypes in documentTypesSelector.js', e);
                }
            })
    }

    fetchProductionUnitDocumentCount(projectId, urlParams, index) {
        let url = `/projects/${projectId}/documents`
        let urlParamsStr = queryString.stringify(urlParams);

        url += `?${urlParamsStr}&offset=0&fetch=$1`;
        axios.get(url)
            .then(payload => {
                this.setState({
                    productionUnits: update(this.state.productionUnits, { [index]: { count: { $set: payload.data.total } } })
                })
            }).catch((e) => {
                if (!axios.isCancel(e)) {
                    console.error('something went wrong when fetching documentTypes in documentTypesSelector.js', e);
                }
            })
    }

    fetchProductionUnits(projectId, offset, fetch) {
        fetchProductionUnitsCall(projectId, this.source.token, offset, fetch)
            .then(payload => {
                this.setState({
                    productionUnits: payload.data._embedded.items,
                    isLoading: false
                });
                return payload;
            }).then(payload => {
                //eslint-disable-next-line
                payload.data._embedded.items.map((productionUnit, i) => {
                    this.fetchProductionUnitSystemCount(projectId, { productionUnit: productionUnit.id }, i);
                    this.fetchProductionUnitDocumentCount(projectId, { 'indirect-references': productionUnit.id }, i)
                })
            })
            .catch((e) => {
                if (!axios.isCancel(e)) {
                    console.error('something went wrong when fetching facilities in facilitiesselector.js', e);
                }
            })
    }

    componentDidMount() {
        this.fetchProductionUnits(this.props.projectId, 0, 1000); // for now
    }

    componentWillUnmount() {
        this.source.cancel();
    }

    render() {
        return (
            this.props.onRender(this.state.productionUnits)
        )
    }
}

export default ProductionUnitSelector;

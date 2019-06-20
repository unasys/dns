import React from 'react';
import ResultItem from '../result-item/ResultItem';
import update from 'immutability-helper';
import axios from 'axios';
import queryString from 'query-string';
import InfiniteScroll from 'react-infinite-scroller';
import NoResultItem from '../result-item/NoResultItem';

const CancelToken = axios.CancelToken;

class EquipmentTypeSelector extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            equipmentTypes: [],
            equipmentTypePageAmount: 50,
            hasMoreEquipmentTypes: true,
            totalEquipmentTypes: null,
            isLoading: true
        }
        this.source = CancelToken.source();
        this.loadMoreEquipmentTypes = this.loadMoreEquipmentTypes.bind(this);
    }

    componentWillUnmount() {
        this.source.cancel();
    }

    fetchEquipmentTagCount(projectId, equipment, index, tagCountUrlParams) {
        let urlParamsStr = queryString.stringify(tagCountUrlParams);
        let url = `/projects/${projectId}/tags?equipmentTypeId=${equipment.id}&${urlParamsStr}&fetch=1`;
        axios.get(url, {
            cancelToken: this.source.token
        })
            .then(payload => {
                this.setState({
                    equipmentTypes: update(this.state.equipmentTypes, { [index]: { count: { $set: payload.data.total } } })
                })
            }).catch((e) => {
                if (!axios.isCancel(e)) {
                    console.error('something went wrong when fetching equipments in equipmentssselector.js', e);
                }
            })
    }

    loadMoreEquipmentTypes(page) {
        let newEquipmentTypeIndex = this.state.equipmentTypePageAmount * page
        if (this.state.totalEquipmentTypes && newEquipmentTypeIndex >= this.state.totalEquipmentTypes) {
            this.setState({
                hasMoreEquipmentTypes: false
            })
        }
        this.fetchEquipmentTypes(this.props.projectId, this.props.urlParams, 0, newEquipmentTypeIndex);
    }

    fetchEquipmentTypes(projectId, urlParams, offset, fetch) {
        let url = `/projects/${projectId}/equipment-types`
        let urlParamsStr = queryString.stringify(urlParams);

        if (urlParamsStr.length !== 0) {
            url += `?${urlParamsStr}&offset=${offset}&fetch=${fetch}`;
        } else {
            url += `?offset=${offset}&fetch=${fetch}`
        }

        axios.get(url, {
            cancelToken: this.source.token
        })
            .then(payload => {
                this.setState({
                    isLoading: false,
                    equipmentTypes: payload.data._embedded.items,
                    totalEquipmentTypes: payload.data.total
                });
                return payload;
            }).then(payload => {
                // eslint-disable-next-line
                payload.data._embedded.items.map((equipment, i) => {
                    if (this.props.tagCount) {
                        this.fetchEquipmentTagCount(projectId, equipment, i, this.props.tagCountUrlParams);
                    }
                })
            })
            .catch((e) => {
                if (!axios.isCancel(e)) {
                    console.error('something went wrong when fetching installations in equipmenttypeselector.js', e);
                }
            })
    }

    render() {
        let equipmentTypeItems =
            this.state.equipmentTypes.map(equipmentType => {
                return <ResultItem key={equipmentType.id} content={equipmentType.name} count={equipmentType.count} contentOnClick={this.props.onEquipmentTypeSelected.bind(this, equipmentType)}></ResultItem>;
            })

        let infiniteEquipmentTypes = (
            <div className="infinity-scroll-container">
                <InfiniteScroll
                    pageStart={0}
                    loadMore={this.loadMoreEquipmentTypes}
                    hasMore={this.state.hasMoreEquipmentTypes}
                    loader={<div className="infinity-scroll-loader">Loading...</div>}
                    useWindow={false}>
                    {equipmentTypeItems}
                </InfiniteScroll>)
            </div>);

        return (
            (this.state.equipmentTypes.length === 0 && this.state.isLoading === false) ? <NoResultItem></NoResultItem> : infiniteEquipmentTypes

        );
    }
}

export default EquipmentTypeSelector;

import React from 'react';
import update from 'immutability-helper';
import axios from 'axios';
import queryString from 'query-string';

const CancelToken = axios.CancelToken;

class EquipmentTypeSelector extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            equipmentTypes: [],
            isLoading: true
        }
        this.source = CancelToken.source();
    }

    componentWillUnmount() {
        this.source.cancel();
    }

    componentDidMount() {
        this.fetchEquipmentTypes(this.props.projectId, this.props.urlParams, 0, 1000); // for now.
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
        return (
            this.props.onRender(this.state.equipmentTypes)
        );
    }

}

export default EquipmentTypeSelector;

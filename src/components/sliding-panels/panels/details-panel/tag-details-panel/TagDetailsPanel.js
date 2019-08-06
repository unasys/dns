import React from 'react';
import { Collapse } from 'react-collapse';
import axios from 'axios';
import '../../Panels.scss';
import ResultItem from '../../../../result-item/ResultItem';
import ConfigInstallationDetailsPanel from '../ConfigInstallationDetailsPanel';
import { getAuxiliaryData } from '../../../../../api/Entities';

const CancelToken = axios.CancelToken;


class TagDetailsPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            location: null,
            area: null,
            productionUnit: null,
            system: null,
            subsystem: null,
            moduleData: null,
            equipmentType: null,
            PropertiesIsOpen: false
        }
        this.source = CancelToken.source();
        this.changePropertyState = this.changePropertyState.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.tag.id !== prevProps.tag.id) {
            // new tag selected. 
            //wipe old state data
            this.setState({
                location: null,
                productionUnit: null,
                system: null,
                area: null,
                subsystem: null,
                moduleData: null,
                equipmentType: null,
                auxiliaryData: null
            })
            this.fetchTagDetails();
            this.fetchAuxiliaryData();
        }
    }

    changePropertyState() {
        this.setState({
            PropertiesIsOpen: !this.state.PropertiesIsOpen
        })
    }

    fetchAuxiliaryData() {
        getAuxiliaryData(this.props.projectId, this.props.tag.id, this.source.token).then(auxiliaryData => {
            this.setState({
                auxiliaryData: auxiliaryData.data
            })
        });
    }

    componentDidMount() {
        this.fetchTagDetails();
        this.fetchAuxiliaryData();
    }

    fetchLocationInformation(url) {
        if (url !== undefined) {
            axios.get(url)
                .then(locationPayload => {
                    this.setState({
                        location: locationPayload.data
                    })
                    if (locationPayload.data._links.area) {
                        axios.get(locationPayload.data._links.area.href)
                            .then(areaPayload => {
                                this.setState({
                                    area: areaPayload.data
                                })
                                if (areaPayload.data._links.module) {
                                    axios.get(areaPayload.data._links.module.href)
                                        .then(modulePayload => {
                                            this.setState({
                                                moduleData: modulePayload.data
                                            });
                                        })
                                }
                            })
                    }
                })
        }
    }

    fetchSubsystemInformation(url) {
        if (url !== undefined) {
            axios.get(url)
                .then(subsystemPayload => {
                    this.setState({
                        subsystem: subsystemPayload.data
                    })
                    if (subsystemPayload.data._links.system) {
                        axios.get(subsystemPayload.data._links.system.href)
                            .then(systemPayload => {
                                this.setState({
                                    system: systemPayload.data
                                })
                                if (systemPayload.data._links.productionUnit) {
                                    axios.get(systemPayload.data._links.productionUnit.href)
                                        .then(productionUnitPrayload => {
                                            this.setState({
                                                productionUnit: productionUnitPrayload.data
                                            })
                                        })
                                }
                            })
                    }
                })
        }
    }

    fetchEquipmentTypeInformation(url) {
        if (url !== undefined) {
            axios.get(url)
                .then(equipmentTypePayload => {
                    this.setState({
                        equipmentType: equipmentTypePayload.data
                    })
                })
        }
    }

    fetchTagDetails() {
        if (this.props.tag._links.location) {
            this.fetchLocationInformation(this.props.tag._links.location.href);
        }
        if (this.props.tag._links.equipmentType) {
            this.fetchEquipmentTypeInformation(this.props.tag._links.equipmentType.href);
        }
        if (this.props.tag._links.subsystem) {
            this.fetchSubsystemInformation(this.props.tag._links.subsystem.href);
        }
    }

    getPropertyName(stateProperty) {
        if (stateProperty && stateProperty.name) {
            return stateProperty.name;
        } else {
            return "";
        }
    }
    render() {
        let content = (
            <div>
                {/*
                    ********** Properties **********
                */}
                {this.state.auxiliaryData ?
                    <ConfigInstallationDetailsPanel installationDetails={this.state.auxiliaryData} projectId={this.props.projectId} entityId={this.props.tag.id}></ConfigInstallationDetailsPanel>
                    : <div className="title-container">
                        <h3 className="tag-title">{this.props.tag.name} </h3>
                    </div>}
                <div className="overview-container" onClick={this.changePropertyState}>
                    <div className="overview-heading">
                        Properties
                    </div>
                    <div className="dropdown-icon">
                        {this.state.PropertiesIsOpen ? <i className="fas fa-chevron-up icon"></i> : <i className="fas fa-chevron-down icon"></i>}
                    </div>
                </div>
                <Collapse isOpened={this.state.PropertiesIsOpen}>
                    <div>
                        <ResultItem content={'ProductionUnit: ' + this.getPropertyName(this.state.productionUnit)} contentOnClick={function () { }} noChevron={true}></ResultItem>
                        <ResultItem content={'System: ' + this.getPropertyName(this.state.system)} contentOnClick={function () { }} noChevron={true}></ResultItem>
                        <ResultItem content={'Area: ' + this.getPropertyName(this.state.area)} contentOnClick={function () { }} noChevron={true}></ResultItem>
                        <ResultItem content={'Equipment Type: ' + this.getPropertyName(this.state.equipmentType)} contentOnClick={function () { }} noChevron={true}></ResultItem>
                        <ResultItem content={'Subsystem: ' + this.getPropertyName(this.state.subsystem)} contentOnClick={function () { }} noChevron={true}></ResultItem>
                        <ResultItem content={'Module: ' + this.getPropertyName(this.state.moduleData)} contentOnClick={function () { }} noChevron={true}></ResultItem>
                        <ResultItem content={'Location: ' + this.getPropertyName(this.state.location)} contentOnClick={function () { }} noChevron={true}></ResultItem>
                    </div>
                </Collapse>
            </div>);

        return (
            content
            //     < SlidingPanel
            //         content = { content }
            // pullRight = { true} >
            //     </SlidingPanel >
        );
    }

}

export default TagDetailsPanel;

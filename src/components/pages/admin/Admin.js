import React, { Component } from 'react';
import Tab from '../../tabs/Tab';
import DropdownTab from '../../tabs/DropdownTab';
import './Admin.scss';
import Systems from './systems/Systems';
import Subsystems from './subsystems/Subsystems';
import Documents from './documents/Documents';
import Facilities from './facilities/Facilities';
import history from '../../../history';
import Modules from './modules/Modules';
import Locations from './locations/Locations';
import Areas from './areas/Areas';
import EquipmentTypes from './equipment/EquipmentTypes';
import Disciplines from './discipline/Disciplines';
import ProductionUnitTypes from './productionunittypes/ProductionUnitTypes';
import ProductionUnits from './productionunit/ProductionUnits'
import Tags from './tags/Tags';
import DocumentTypes from './documentTypes/DocumentTypes';

const defaultAdminRoute = 'systems';

class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabs: [
                { name: 'Production Unit Types', id: 15, route: 'production-unit-types' },
                { name: 'Production Unit', id: 16, route: 'production-unit' },
                { name: 'Systems', id: 0, route: 'systems' },
                { name: 'Subsystems', id: 1, route: 'subsystems' },
                { name: 'Facilities', id: 2, route: 'facilities' },
                { name: 'Modules', id: 3, route: 'modules' },
                { name: 'Locations', id: 4, route: 'locations' },
                { name: 'Areas', id: 5, route: 'areas' },
                { name: 'Equipment', id: 6, route: 'equipment' },
                { name: 'Tags', id: 7, route: 'tags' },
                { name: 'Disciplines', id: 8, route: 'disciplines' },
                // { name: 'Test Procedure Types', id: 9, route: 'test-procedure-types' },
                // { name: 'Test Procedures', id: 10, route: 'test-procedures' },
                // { name: 'Test Procedure Steps', id: 11, route: 'test-procedure-steps' },
                // { name: 'Activities', id: 12, route: 'activities' },
                // { name: 'Activity Steps', id: 13, route: 'activity-steps' },
                { name: 'Documents', id: 14, route: 'documents' },
                { name: 'Document Types', id: 17, route: 'document-types' }
            ],
            activeTabId: 0
        }
        this.setActiveTab = this.setActiveTab.bind(this);
    }

    initialiseActiveTab() {
        let page = this.props.match.params.page
        let activeTab = this.state.tabs.find(function (tab) {
            return tab.route === page
        });
        if (activeTab) { // tab found matching current route page
            this.setState({
                activeTabId: activeTab.id
            })
        }
    }

    componentDidMount() {
        this.initialiseActiveTab()
    }

    setActiveTab(tabId) {
        let tab = this.state.tabs.find(function (tab) {
            return tab.id === tabId
        });

        if (tab) {
            if (this.props.match.params.page) {
                history.replace(`${tab.route}`);
            } else {
                history.push(`admin/${tab.route}`);
            }
        }
        this.setState({
            activeTabId: tabId
        })
    }

    getTabContent(activeTabId) {
        let projectId = this.props.match.params.currentProjectId;
        let page = this.props.match.params.page;
        if (!page) {
            page = defaultAdminRoute;
        }
        switch (page) {
            case 'systems':
                return <Systems projectId={projectId}></Systems>
            case 'subsystems':
                return <Subsystems projectId={projectId}></Subsystems>
            case 'facilities':
                return <Facilities projectId={projectId}></Facilities>
            case 'documents':
                return <Documents projectId={projectId}></Documents>
            case 'modules':
                return <Modules projectId={projectId}></Modules>
            case 'locations':
                return <Locations projectId={projectId}></Locations>
            case 'areas':
                return <Areas projectId={projectId}></Areas>
            case 'equipment':
                return <EquipmentTypes projectId={projectId}></EquipmentTypes>
            case 'disciplines':
                return <Disciplines projectId={projectId}></Disciplines>
            case 'tags':
                return <Tags projectId={projectId}></Tags>
            case 'production-unit-types':
                return <ProductionUnitTypes projectId={projectId}></ProductionUnitTypes>
            case 'production-unit':
                return <ProductionUnits projectId={projectId}></ProductionUnits>
            case 'document-types':
                return <DocumentTypes projectId={projectId}></DocumentTypes>
            default:
                return <div></div>;
        }
    }

    render() {
        let tabs = (<div className="admin-tabs-container">
            {this.state.tabs.map(tab => {
                if (tab.isDropdown) {
                    return <DropdownTab
                        initialName={tab.name}
                        dropdowns={tab.dropdowns}
                        key={tab.name}>
                    </DropdownTab>
                } else {
                    return <Tab
                        name={tab.name}
                        key={tab.id}
                        isActive={this.state.activeTabId === tab.id}
                        onClick={this.setActiveTab}
                        id={tab.id}>
                    </Tab>
                }
            })}
        </div>);

        return (
            <div className="admin-container">
                {tabs}
                <div className="admin-content-container">
                    {this.getTabContent(this.state.activeTabId)}
                </div>
            </div>)
    }
}

export default Admin;
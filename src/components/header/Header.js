import React, { Component } from 'react';
import './Header.scss';
import Tab from '../tabs/Tab';
import { connect } from 'react-redux';
import history from '../../history';
//import DropdownTab from '../tabs/DropdownTab';
import { changeInstallationFilterType } from '../../actions/installationActions';
import DigitalNorthSeaLogo from '../../assets/DigitalNorthSeaLogo';
import { INSTALLATION_FILTER_TYPES } from '../../actions/installationActions';
import { changeActiveTab } from '../../actions/headerActions';

export const initialTabState = { name: 'Oil& Gas', id: 0};

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabs: [
        {
          name: 'Oil & Gas', id: 0, filter: "INSTALLATION_FILTER_TYPES.OilAndGas", route: () => this.getMapRoute(), 
        },
        { 
          name: 'Offshore Wind', id: 1, filter: "INSTALLATION_FILTER_TYPES.OffShoreWind", route: () => this.getMapRoute()
        },
        { 
          name: 'Bathymetry', id: 2, route: () => this.getBathymetryRoute()
        }
      ],
      activeTab: initialTabState,
      highlevelShowing: false
    }

    this.setActiveTab = this.setActiveTab.bind(this);
    this.toggleHighLevelShowing = this.toggleHighLevelShowing.bind(this);
  }
  getBathymetryRoute() {
    return '/bathymetry';
  }
  getMapRoute() {
    if (this.props.projectId) {
      return `/projects/${this.props.projectId}`;
    }
    return '/';
  }
  toggleHighLevelShowing() {
    this.setState({
      highlevelShowing: !this.state.highlevelShowing
    })
  }
  // finds tab by id, sets it as the current active tab in state, and redirects user to the tab's route.
  setActiveTab(id) {  

    //manage header state (set active tab) 
    let activeTab = this.state.tabs.find(function (tab) {return tab.id === id;});
    if (activeTab !== undefined) {
      this.setState({
        activeTab: activeTab
      });
    this.props.changeActiveTab(activeTab);
    console.log(activeTab);
    console.log(activeTab.id);
    //set route/url
    //change map/filter
    if (activeTab.id === 0){
      console.log(activeTab.filter);
      this.props.changeInstallationFilterType(INSTALLATION_FILTER_TYPES.OilAndGas);
      //.getMapRoute()
    }
    if (activeTab.id === 1){
      console.log(activeTab.filter);
      this.props.changeInstallationFilterType(INSTALLATION_FILTER_TYPES.OffshoreWind);
      //.getMapRoute()
    }    

      if (activeTab.route !== null && activeTab.route !== undefined) {
        history.push(activeTab.route()); 
        console.log(activeTab.route());
      }
    }

  }

  render() {
    //this.state.tabs.map( tab => tab.tabOnClick(tab)) 

    let tabs = (<div className="navigation-tabs">
      {this.state.tabs.map(tab => {
        // if (tab.isDropdown) {
        //   return <DropdownTab
        //     initialName={tab.name}
        //     dropdowns={tab.dropdowns}
        //     isActive={this.state.activeTab.id === tab.id}
        //     key={tab.name}
        //     onMainClick={tab.onMainClick}>
        //   </DropdownTab>
        // } else {
        return <Tab
            name={tab.name}
            key={tab.id}
            isActive={this.state.activeTab.id === tab.id}
            onClick={this.setActiveTab}
            id={tab.id}>
          </Tab>
        //}
      })}
    </div>);

    return (
      <div className="header-container">
        <div className="logo-container" onClick={() => {
          history.push(this.getMapRoute())
          this.setActiveTab(0)
        }}>
          <DigitalNorthSeaLogo></DigitalNorthSeaLogo>
        </div>
        <>
          {tabs}
        </>
        <div className="spacer">
        </div>

      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    changeActiveTab: (activeTab) => {
      dispatch(changeActiveTab(activeTab))
    },
    changeInstallationFilterType: (filterType) => {
      dispatch(changeInstallationFilterType(filterType))
    }
  }
}

export default connect(null, mapDispatchToProps)(Header)
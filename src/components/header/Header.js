import React, { Component, PropTypes } from 'react';
import './Header.scss';
import '../../components/tabs/Tab.js';
import Tab from '../tabs/Tab';
import { connect } from 'react-redux';
import history from '../../history';
import { changeInstallationFilterType } from '../../actions/installationActions';
import DigitalNorthSeaLogo from '../../assets/DigitalNorthSeaLogo';
import { INSTALLATION_FILTER_TYPES } from '../../actions/installationActions';
import { changeActiveTab } from '../../actions/headerActions';
import '../../../node_modules/react-dd-menu/src/scss/react-dd-menu.scss';
export const initialTabId = { id: 0 };

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabs: [
        {
          name: 'Oil & Gas', id: 0, filter: INSTALLATION_FILTER_TYPES.OilAndGas, route: ""
        },
        {
          name: 'Offshore Wind', id: 1, filter: INSTALLATION_FILTER_TYPES.OffshoreWind, route: ""
        },
        {
          name: 'Bathymetry', id: 2, route: "bathymetry"
        }
      ],
      isDropOpen: false,

      activeTab: initialTabId,
    }
    this.onTabClick = this.onTabClick.bind(this);
    this.onDropClick = this.onTabClick.bind(this);
  }
  setActiveTab(newActiveTab) {
    this.setState({
      activeTab: newActiveTab
    });
    // lets other components know what the currently active tab is.
    this.props.changeActiveTab(newActiveTab);
  }
  // finds tab by id, sets it as the current active tab in state, and redirects user to the tab's route.
  onTabClick(id) {
    //manage header state (set active tab) 
    let newActiveTab = this.state.tabs.find(function (tab) { return tab.id === id; });
    if (!newActiveTab) {
      return;
    }
    this.setActiveTab(newActiveTab);
    //change map/filter
    if (newActiveTab.filter) {
      this.props.changeInstallationFilterType(newActiveTab.filter);
    }
    //set route/url
    if (newActiveTab.route !== undefined) {
      history.push(newActiveTab.route);
    }
  }
  render() {
    let tabs = (<div className="navigation-tabs">
      {this.state.tabs.map(tab => {
        return <Tab
          name={tab.name}
          key={tab.id}
          isActive={this.state.activeTab.id === tab.id}
          onClick={this.onTabClick}
          id={tab.id}>
        </Tab>
      })}
    </div>);
    return (
      <div className="header-container">
        <div className="logo-container" onClick={() => {
          history.push("")
          this.onTabClick(0)
        }}>
          <DigitalNorthSeaLogo></DigitalNorthSeaLogo>
        </div>
        {tabs}
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
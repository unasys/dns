import React, { Component } from 'react';
import './Header.scss';
import Tab from '../tabs/Tab';
import { connect } from 'react-redux';
import history from '../../history';
import DropdownTab from '../tabs/DropdownTab';
import { changeInstallationFilterType } from '../../actions/installationActions';
import DigitalNorthSeaLogo from '../../assets/DigitalNorthSeaLogo';
import { INSTALLATION_FILTER_TYPES } from '../../actions/installationActions';
import { changeActiveTab } from '../../actions/headerActions';

export const initialTabState = { name: 'Oil & Gas', id: 0 };

class Header extends Component {
  constructor(props) {
    super(props);

    this.oilAndGasOnClick = this.oilAndGasOnClick.bind(this);
    this.wasteToEnergyOnClick = this.wasteToEnergyOnClick.bind(this);
    this.offshoreWindOnClick = this.offshoreWindOnClick.bind(this);
    this.makeRouteTabActive = this.makeRouteTabActive.bind(this);

    const oilAndGasDropdowns = [
      { name: 'Oil & Gas', onClick: this.oilAndGasOnClick },
      { name: 'Offshore Wind', onClick: this.offshoreWindOnClick },
      { name: 'Waste to Energy', onClick: this.wasteToEnergyOnClick }
    ]

    this.state = {
      tabs: [
        {
          name: 'Oil & Gas', id: 0, isDropdown: true, changeNameOnDropdownClick: true, dropdowns: oilAndGasDropdowns, route: () => this.getHomeRoute(), onMainClick: () => {
            history.push(this.getHomeRoute())
            this.setActiveTab(0)
          }
        },

        { name: 'Bathymetry', id: 1, route: () => this.getBathymetryRoute() }
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

  getHomeRoute() {
    if (this.props.projectId) {
      return `/projects/${this.props.projectId}`;
    }
    return '/';
  }

  oilAndGasOnClick() {
    this.setActiveTab(0);
    this.props.changeInstallationFilterType(INSTALLATION_FILTER_TYPES.OilAndGas);
  }
  wasteToEnergyOnClick() {
    this.setActiveTab(0);
    this.props.changeInstallationFilterType(INSTALLATION_FILTER_TYPES.WasteToEnergy);
  }
  offshoreWindOnClick() {
    this.setActiveTab(0);
    this.props.changeInstallationFilterType(INSTALLATION_FILTER_TYPES.OffshoreWind);
  }
  
  toggleHighLevelShowing() {
    this.setState({
      highlevelShowing: !this.state.highlevelShowing
    })
  }

  makeRouteTabActive() {
    let currentPathname = this.props.location.pathname;
    let noRedirect = false;
    let tabMatchingRoute = (this.state.tabs.find(function (tab) {
      return tab.route() === (currentPathname);
    }));
    if (tabMatchingRoute !== undefined) {
      this.setActiveTab(tabMatchingRoute.id, noRedirect);
    }
  }

  // handles browser refresh, if the current route is in the list of active tabs, set this tab as active.
  componentDidMount() {
    this.makeRouteTabActive();
  }

  redirectToRoute(tab) {
    if (tab.route !== null && tab.route !== undefined) {
      history.push(tab.route());
    }
  }

  // finds tab by id, sets it as the current active tab in state, and redirects user to the tab's route.
  setActiveTab(id, noRedirect) {    
    let activeTab = this.state.tabs.find(function (tab) {
      return tab.id === id;
    });
    if (activeTab !== undefined) {
      this.setState({
        activeTab: activeTab
      });
      this.props.changeActiveTab(activeTab);
      if (!noRedirect) {
        this.redirectToRoute(activeTab);
      }
    }
  }

  render() {
    let tabs = (<div className="navigation-tabs">
      {this.state.tabs.map(tab => {
        if (tab.isDropdown) {
          return <DropdownTab
            initialName={tab.name}
            dropdowns={tab.dropdowns}
            isActive={this.state.activeTab.id === tab.id}
            key={tab.name}
            onMainClick={tab.onMainClick}
            changeNameOnDropdownClick={tab.changeNameOnDropdownClick}>
          </DropdownTab>
        } else {
          return <Tab
            name={tab.name}
            key={tab.id}
            isActive={this.state.activeTab.id === tab.id}
            onClick={this.setActiveTab}
            id={tab.id}>
          </Tab>
        }
      })}
    </div>);

    return (
      <div className="header-container">
        <div className="logo-container" onClick={() => {
          history.push(this.getHomeRoute())
          this.setActiveTab(0)
        }}>
          <DigitalNorthSeaLogo></DigitalNorthSeaLogo>
        </div>
        <div className="tab-container">
          {tabs}
        </div>
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
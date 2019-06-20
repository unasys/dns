import React, { Component } from 'react';
import './Header.scss';
import Tab from '../tabs/Tab';
import { changeActiveTab } from '../../actions/headerActions';
import axios from 'axios';
import { connect } from 'react-redux';
import history from '../../history';
import DropdownTab from '../tabs/DropdownTab';
import { changeSketchfabId } from '../../actions/sketchfabActions';
import { changeWalkthroughSrc } from '../../actions/walkthroughActions';
import { changeCurrentInstallation, changeInstallationFilterType } from '../../actions/installationActions';
import DigitalNorthSeaLogo from '../../assets/DigitalNorthSeaLogo';
import { INSTALLATION_FILTER_TYPES } from '../../actions/installationActions';
import Search from '../search/Search';
import DataroomDropdowns from './DataroomDropdowns';
import eiderDropdown from '../../assets/eider-circle-dropdown.png'

export const initialTabState = { name: 'Oil & Gas', id: 0 };


class Header extends Component {
  constructor(props) {
    super(props);

    this.oilAndGasOnClick = this.oilAndGasOnClick.bind(this);
    this.wasteToEnergyOnClick = this.wasteToEnergyOnClick.bind(this);
    this.offshoreWindOnClick = this.offshoreWindOnClick.bind(this);
    this.myProjectsOnClick = this.myProjectsOnClick.bind(this);
    this.makeRouteTabActive = this.makeRouteTabActive.bind(this);

    const oilAndGasDropdowns = [
      { name: 'Oil & Gas', onClick: this.oilAndGasOnClick },
      { name: 'Offshore Wind', onClick: this.offshoreWindOnClick },
      { name: 'Waste to Energy', onClick: this.wasteToEnergyOnClick },
      { name: 'My Projects', onClick: this.myProjectsOnClick }
    ]

    this.state = {
      initialTabs: [

        {
          name: 'Oil & Gas', id: 0, isDropdown: true, changeNameOnDropdownClick: true, dropdowns: oilAndGasDropdowns, route: () => this.getHomeRoute(), onMainClick: () => {
            history.push(this.getHomeRoute())
            this.setActiveTab(0)
          }
        },

        //{ name: 'Bathymetry', id: 1, route: () => this.getBathymetryRoute() }
      ],
      tabsFromConfig: [],
      activeTab: initialTabState,
      projectConfig: null,
      highlevelShowing: false
    }

    this.setActiveTab = this.setActiveTab.bind(this);
    this.clearCurrentProject = this.clearCurrentProject.bind(this);
    this.toggleHighLevelShowing = this.toggleHighLevelShowing.bind(this);
  }

  getBathymetryRoute() {
    if (this.props.projectId) {
      return `/projects/${this.props.projectId}/bathymetry`;
    }
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
    this.clearCurrentProject();
    this.props.changeInstallationFilterType(INSTALLATION_FILTER_TYPES.OilAndGas);
  }
  wasteToEnergyOnClick() {
    this.setActiveTab(0);
    this.clearCurrentProject();
    this.props.changeInstallationFilterType(INSTALLATION_FILTER_TYPES.WasteToEnergy);
  }
  offshoreWindOnClick() {
    this.setActiveTab(0);
    this.clearCurrentProject();
    this.props.changeInstallationFilterType(INSTALLATION_FILTER_TYPES.OffshoreWind);
  }
  myProjectsOnClick() {
    this.setActiveTab(0);
    this.clearCurrentProject();
    this.props.changeInstallationFilterType(INSTALLATION_FILTER_TYPES.MyProjects);
  }
  
  toggleHighLevelShowing() {
    this.setState({
      highlevelShowing: !this.state.highlevelShowing
    })
  }

  makeRouteTabActive() {
    let currentPathname = this.props.location.pathname;
    let combinedTabs = this.state.initialTabs.concat(this.props.projectSpecificTabs).concat(this.state.tabsFromConfig);
    let adminUrl = `/projects/${this.props.projectId}/admin`
    let noRedirect = false;
    let tabMatchingRoute = (combinedTabs.find(function (tab) {
      if (currentPathname.startsWith(adminUrl)) {
        if (tab.route().startsWith(adminUrl)) {
          noRedirect = true;
          return true;
        }
      }
      return tab.route() === (currentPathname);
    }));
    if (tabMatchingRoute !== undefined) {
      this.setActiveTab(tabMatchingRoute.id, noRedirect);
    }
  }

  // handles browser refresh, if the current route is in the list of active tabs, set this tab as active.
  componentDidMount() {
    this.makeRouteTabActive();
    this.fetchProjectConfig(this.props.projectId);
  }

  redirectToRoute(tab) {
    if (tab.route !== null && tab.route !== undefined) {
      history.push(tab.route());
    }
  }

  // Adds world map - 3D Model - Walkthrough tabs based on project config.
  fetchProjectConfig(projectId) {
    if (projectId === null || projectId === '') return;
    axios.get(`/projects/${projectId}/config`)
      .then(payload => {
        this.setState({
          projectConfig: payload.data
        });
        if (payload.data.InitialLoadSketchfabId) {
          this.props.changeSketchfabId(payload.data.InitialLoadSketchfabId);
          this.props.changeMainContent(1);
        }
        return payload;
      }).then(payload => {
        let onWorldMapClick = () => {
          this.props.changeMainContent(0);
        }
        let dropdowns = [{ name: 'World Map', onClick: onWorldMapClick }]

        if (payload.data.InitialLoadSketchfabId) {

          let onModelClick = () => {
            this.props.changeSketchfabId(payload.data.InitialLoadSketchfabId);
            this.props.changeMainContent(1);
          }
          dropdowns.push({ name: '3D Model', onClick: onModelClick });
        }

        
        if (payload.data.WalkthroughURL) {
          let onWalkthroughClick = () => {
            this.props.changeWalkthroughSrc(payload.data.WalkthroughURL)
            this.props.changeMainContent(2);
          }
          
          dropdowns.push({ name: 'Walkthrough', onClick: onWalkthroughClick })
        }
        dropdowns.push({ name: 'Overview', onClick: () => this.props.changeMainContent(3) });
        
        let tabs = [];

        if (payload.data.WeightsAndMaterialsTab) {
          tabs.push({ name: 'Weights & Materials', id: 6, route: () => `/projects/${projectId}/weightsandmaterials` })
        }

        tabs.push({ name: 'Backdrop', id: 4, isDropdown: true, dropdowns: dropdowns });
        this.setState({
          tabsFromConfig: tabs
        })
        this.makeRouteTabActive();
      })
      .catch((e) => {
        console.error('something went wrong fetching project config in header.', e)
      })
  }

  componentDidUpdate(prevProps) {
    if (this.props.projectId !== prevProps.projectId) {
      // projectid has changed, re-look up its config. 
      this.fetchProjectConfig(this.props.projectId);
    }
  }

  // finds tab by id, sets it as the current active tab in state, and redirects user to the tab's route.
  setActiveTab(id, noRedirect) {
    let initialTabs = this.state.initialTabs;
    let combinedTabs = initialTabs.concat(this.props.projectSpecificTabs).concat(this.state.tabsFromConfig);
    let activeTab = combinedTabs.find(function (tab) {
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

  clearCurrentProject() {
    this.setState({
      projectConfig: null,
      activeTab: initialTabState,
      tabsFromConfig: []
    })
    this.props.changeMainContent(0);
    this.props.changeCurrentInstallation(null);
    history.replace('/');
  }



  render() {
    const hasFacilityName = this.state.projectConfig && this.state.projectConfig.ProjectName !== null

    let initialTabs = this.state.initialTabs;
    let combinedTabs = initialTabs.concat(this.props.projectSpecificTabs).concat(this.state.tabsFromConfig);

    let tabs = (<div className="navigation-tabs">
      {combinedTabs.map(tab => {
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
      }).concat(this.props.projectId && <DataroomDropdowns projectId={this.props.projectId}></DataroomDropdowns>)}
    </div>);

    return (
      <div className="header-container">
        <div className="logo-container" onClick={() => {
          history.push(this.getHomeRoute())
          this.setActiveTab(0)
        }}>
          <DigitalNorthSeaLogo></DigitalNorthSeaLogo>
        </div>

        {this.props.projectId &&
          <Search
            projectId={this.props.projectId}
            isDataRoom={this.state.activeTab.id === 7}>
          </Search>
        }


        {tabs}

        {hasFacilityName ?

          <div className="selected-installation-box">
            <img className="installation-thumbnail" src={`https://epmdata.blob.core.windows.net/assets/images/${this.state.projectConfig["Image ID"]}.jpg`} alt="overview-thumbnail" onClick={this.toggleHighLevelShowing}></img>
            {this.state.highlevelShowing && <div className="installation-highlevel-view">
                <img src={eiderDropdown}></img>
            </div>}
            {<i className="fas fa-times close-button" onClick={this.clearCurrentProject}></i>}
          </div> : <div className="spacer" />}
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    changeActiveTab: (activeTab) => {
      dispatch(changeActiveTab(activeTab))
    },
    changeSketchfabId: (sketchfabId) => {
      dispatch(changeSketchfabId(sketchfabId));
    },
    changeWalkthroughSrc: (walkthroughSrc) => {
      dispatch(changeWalkthroughSrc(walkthroughSrc));
    },
    changeCurrentInstallation: (currentInstallation) => {
      dispatch(changeCurrentInstallation(currentInstallation))
    },
    changeInstallationFilterType: (filterType) => {
      dispatch(changeInstallationFilterType(filterType))
    }
  }
}

function parsePathName(pathname) {
  let parts = pathname.split('/');
  if (parts.length >= 3) {
    return parts[2]; 
  }
  return null;
}

function mapStateToProps(state) {
  let pathname = state.router.location.pathname;
  let projectId = parsePathName(pathname);
  let projectSpecificTabs = [];

  if (projectId) {
    projectSpecificTabs = projectSpecificTabs.concat([
      { name: 'Definition', id: 3, route: () => `/projects/${projectId}/definitionandstatus` }
    ]);
  }

  return {
    pathname: pathname,
    projectId: projectId,
    projectSpecificTabs: projectSpecificTabs,
    currentInstallation: state.InstallationReducer.currentInstallation,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
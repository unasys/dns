import React, { Component } from 'react';
import './Header.scss';
import '../../components/tabs/Tab.js';
import Tab from '../tabs/Tab';
import { connect } from 'react-redux';
import history from '../../history';
import { changeInstallationFilterType } from '../../actions/installationActions';
import DigitalNorthSeaLogo from '../../assets/DigitalNorthSeaLogo';
import { INSTALLATION_FILTER_TYPES } from '../../actions/installationActions';
import { changeActiveTab } from '../../actions/headerActions';
import DropdownMenu, { NestedDropdownMenu } from 'react-dd-menu';
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
    this.toggle = this.toggle.bind(this);
    this.close = this.close.bind(this);
  }

  toggle = () => {
    this.setState({ isDropOpen: !this.state.isDropOpen });
    console.log(this.state.isDropOpen);
  }

  close = () => {
    this.setState({ isDropOpen: false });
  };

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


    //if test tab 
    if (newActiveTab.id === 3) {
      console.log("3");
      //toggle drop? call show dropdown function?
      this.toggle();

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

    const menuOptions = {
      isOpen: this.state.isDropOpen,
      close: this.close,
      toggle: <Tab name="Testing Tab" onClick={this.toggle}></Tab>,

      
    };
    const nestedProps = {
      toggle: <Tab name="Peek a Boo"></Tab>,
      animate: true,


    };

    return (
      <div className="header-container">
        <div className="logo-container" onClick={() => {
          history.push("")
          this.onTabClick(0)
        }}>
          <DigitalNorthSeaLogo></DigitalNorthSeaLogo>
        </div>
        
          {tabs}
        
        <div className="dd-menu">
        <DropdownMenu {...menuOptions}>
            <Tab name="Example 1"></Tab>
            <Tab name="Example 2"onClick={this.onTabClick}></Tab>
            <li role="separator" className="separator" />
            <NestedDropdownMenu toggle={<Tab name="Multi-Level Menu"><span className="fa fa-chevron-right" nested="right" animAlign="left" /></Tab>}>
              <Tab name="Still in a list" animAlign="left">I am in a Nested Menu!</Tab>
            </NestedDropdownMenu>
        </DropdownMenu>
        
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
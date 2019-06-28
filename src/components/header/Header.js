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
        },
        {
          name: 'Test Tab', id: 3, route: "test"
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

//toggle: <Tab name="Testing Tab" onClick={this.toggle}></Tab>,
    const menuOptions = {
      isOpen: this.state.isDropOpen,
      close: this.close,
      //toggle:<div onClick={this.toggle}>shh</div>,
      size: "xl",
      animAlign: 'left',
      align: 'center'
    };
    const nestedProps = {
      //toggle: <li name="Peek a Boo">hi</li>,
      animate: true,
      animAlign: 'left',
      inverse: true,
      align: 'right',
      size: "xl"
    };
    //<li role="separator" className="separator" />

    return (
      <div className="header-container">
        <div className="logo-container" onClick={() => {
          history.push("")
          this.onTabClick(0)
        }}>
          <DigitalNorthSeaLogo></DigitalNorthSeaLogo>
        </div>
        
          {tabs}
        
        <div className="dd-menu dd-menu-left dd-menu-inverse ">
        <DropdownMenu {...menuOptions}
          >
            <li name="Example 1"><button type="button"> Example 1 </button> </li>
            <li name="Example 2"onClick={this.onTabClick}><button type="button"> Example 2 </button></li>
            
            <NestedDropdownMenu 
              className="nested-dd-menu nested-reverse"
              //{...nestedProps}
              toggle={<div> Dropdown   <span className="fa fa-chevron-right" /></div>}
              >
              <li name="Still in a list" nested="left" align="right"><button type="button"> I am in a Nested Menu!</button> </li>
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
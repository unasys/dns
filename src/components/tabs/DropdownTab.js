import './DropdownTab.scss';
import React, { Component } from 'react';

class DropdownTab extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentName: this.props.initialName,
            hoveredItemName: null,
        }
        this.onMainTabClick = this.onMainTabClick.bind(this);
        this.handleSelectedId = this.handleSelectedId.bind(this);
    }

    changeCurrentName(name) {
        this.setState({
            currentName: name
        })
    }

    onMainTabClick() {
        if (this.state.mainTabClicked === this.state.currentName) {
            this.setState({
                mainTabClicked: null
            })
        } else {
            this.setState({
                mainTabClicked: this.state.currentName
            })
        }
        if (this.props.onMainClick) {
            this.props.onMainClick();
        }
    }

    handleSelectedId = (name) => {
        let newName = null;
        if (name !== this.state.hoveredItemName) {
            newName = name;
        }
        this.setState({
            hoveredItemName: newName
        })
    }

    render() { 
        let dropdowns = this.props.dropdowns.map(dropdown => {
            let secondLevelDropdown;

            if (dropdown.isSecondLevelDropdown && this.state.hoveredItemName === dropdown.name) {
                secondLevelDropdown = (
                    <div style={{borderLeft: '1px solid #666973', marginLeft: '20px'}}>
                        <DropdownTab
                            dropdowns={dropdown.dropdowns}
                            secondLevel={true}>
                        </DropdownTab>
                    </div>
                )
            }

            return <div className="dropdown-option" key={dropdown.name} 
                            // onMouseEnter={
                            //     () => { this.handleSelectedId(dropdown.name) }
                            // }
                            onClick={() =>
                                { 
                                    dropdown.onClick();
                                    this.handleSelectedId(dropdown.name);
                                    if (this.props.changeNameOnDropdownClick) {
                                        this.changeCurrentName(dropdown.name);
                                    }
                                }
                            }>
                        {dropdown.name}
                   {secondLevelDropdown}
                   </div>
        })

        return (
            <>
                <div className={!this.props.secondLevel && "tab-container " + (this.props.isActive ? 'active' : '')}>
                    <div className="tab" onClick={this.onMainTabClick}>
                        {this.state.currentName}
                    </div>
                    {this.state.mainTabClicked === this.state.currentName &&
                    <div className={!this.props.secondLevel && "dropdown-options-container"}>
                        {dropdowns}
                    </div>}
                </div>
            </>);
    };
}

export default DropdownTab;
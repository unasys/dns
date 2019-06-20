import React, { Component } from "react";
import SubsystemsTable from "./SubsystemsTable";
import './styles/Subsystems.scss';
import ActionPanel from "./ActionPanel";
import FilterPanel from '../panels/FilterPanel';

class SubSystems extends Component {

    constructor(props) {
        super(props);
        this.state = {
            filterBarOpen: false,
            systemFilter: null, // only makes an affect in when subsystems table when its value changes.
            selectedSubsystem: null
        }
        this.openCreateModal = this.openCreateModal.bind(this);
        this.onSystemFilter = this.onSystemFilter.bind(this);
        this.selectSubsystem = this.selectSubsystem.bind(this);
    }

    selectSubsystem(subsystem) {
        this.setState({
            selectedSubsystem: subsystem
        })
    }

    openCreateModal() {
        this.setState({
            filterBarOpen: !this.state.filterBarOpen,
            systemFilter: (this.state.filterBarOpen ? null : this.state.systemFilter) // if state is currently true, which means the filter panel is closing. 
        })
    }

    onSystemFilter(system) {
        this.setState({
            systemFilter: system
        })
    }

    render() {
        return (
            <div className="subsystems-grid-container">
                <div className="top-bar">
                    <button type="button" onClick={this.openCreateModal} className="button is-success margin-top-left">{'Filter'}</button>
                </div>
                {this.state.filterBarOpen &&
                    <div className="left-sidebar">
                        <FilterPanel projectId={this.props.projectId} onSystemFilter={this.onSystemFilter}></FilterPanel>
                    </div>
                }
                <div className="main-content">
                    <SubsystemsTable projectId={this.props.projectId} systemFilter={this.state.systemFilter} selectSubsystem={this.selectSubsystem}></SubsystemsTable>
                </div>
                <div className="right-sidebar">
                    <ActionPanel entity="Subsystem" projectId={this.props.projectId} selectedSubsystem={this.state.selectedSubsystem}></ActionPanel>
                </div>
            </div>
        )
    }
}

export default SubSystems;
import React, { Component } from "react";
import SystemsTable from "./SystemsTable";
import './styles/Systems.scss';
import ActionPanel from "./ActionPanel";

class Systems extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedSystem: null
        }
        this.selectSystem = this.selectSystem.bind(this);
    }

    selectSystem(system) {
        this.setState({
            selectedSystem: system
        })
    }
    render() {
        return (
            <div className="systems-grid-container">
                <div className="main-content">
                    <SystemsTable projectId={this.props.projectId} selectSystem={this.selectSystem}></SystemsTable>
                </div>
                <div className="right-sidebar">
                    <ActionPanel entity="System" projectId={this.props.projectId} selectedSystem={this.state.selectedSystem}></ActionPanel>
                </div>
            </div>
        )
    }
}

export default Systems;
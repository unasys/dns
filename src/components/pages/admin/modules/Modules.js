import React, { Component } from "react";
import ModulesTable from "./ModulesTable";
import './styles/Modules.scss';
import ActionPanel from "./ActionPanel";

class Modules extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedModule: null
        }
        this.selectModule = this.selectModule.bind(this);
    }

    selectModule(moduleObject) {
        this.setState({
            selectedModule: moduleObject
        })
    }

    render() {
        return (
            <div className="modules-grid-container">
                <div className="main-content">
                    <ModulesTable projectId={this.props.projectId} selectModule={this.selectModule}></ModulesTable>
                </div>
                <div className="right-sidebar">
                    <ActionPanel entity="Module" projectId={this.props.projectId} selectedModule={this.state.selectedModule}></ActionPanel>
                </div>
            </div>
        )
    }
}

export default Modules;
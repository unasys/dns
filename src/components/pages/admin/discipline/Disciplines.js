import React, { Component } from "react";
import './styles/Disciplines.scss';
import ActionPanel from "./DisciplinePanel";
import DisciplinesTable from "./DisciplinesTable";

class Disciplines extends Component {
    render() {
        return (
            <div className="disciplines-grid-container">
                <div className="main-content">
                    <DisciplinesTable projectId={this.props.projectId}></DisciplinesTable>
                </div>
                <div className="right-sidebar">
                    <ActionPanel entity="Discipline" projectId={this.props.projectId}></ActionPanel>
                </div>
            </div>
        )
    }
}

export default Disciplines;
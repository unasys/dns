import React, { Component } from "react";
import FacilitiesTable from "./FacilitiesTable";
import './styles/Facilities.scss';
import ActionPanel from "./ActionPanel";

class Facilities extends Component {
    render() {
        return (
            <div className="facilities-grid-container">
                <div className="main-content">
                    <FacilitiesTable projectId={this.props.projectId}></FacilitiesTable>
                </div>
                <div className="right-sidebar">
                    <ActionPanel entity="Facility" projectId={this.props.projectId}></ActionPanel>
                </div>
            </div>
        )
    }
}

export default Facilities;
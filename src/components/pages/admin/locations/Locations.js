import React, { Component } from "react";
import LocationsTable from "./LocationsTable";
import './styles/Locations.scss';
import ActionPanel from "./ActionPanel";

class Locations extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedLocation: null
        }
        this.selectLocation = this.selectLocation.bind(this);
    }

    selectLocation(location) {
        this.setState({
            selectedLocation: location
        })
    }

    render() {
        return (
            <div className="locations-grid-container">
                <div className="main-content">
                    <LocationsTable projectId={this.props.projectId} selectLocation={this.selectLocation}></LocationsTable>
                </div>
                <div className="right-sidebar">
                    <ActionPanel entity="Location" projectId={this.props.projectId} selectedLocation={this.state.selectedLocation}></ActionPanel>
                </div>
            </div>
        )
    }
}

export default Locations;
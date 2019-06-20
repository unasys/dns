import React, { Component } from "react";
import AreasTable from "./AreasTable";
import './styles/Areas.scss';
import ActionPanel from "./ActionPanel";

class Areas extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedArea: null
        }
        this.selectArea = this.selectArea.bind(this);
    }

    selectArea(area) {
        this.setState({
            selectedArea: area
        })
    }

    render() {
        return (
            <div className="locations-grid-container">
                <div className="main-content">
                    <AreasTable projectId={this.props.projectId} selectArea={this.selectArea}></AreasTable>
                </div>
                <div className="right-sidebar">
                    <ActionPanel entity="Area" projectId={this.props.projectId} selectedArea={this.state.selectedArea}></ActionPanel>
                </div>
            </div>
        )
    }
}

export default Areas;
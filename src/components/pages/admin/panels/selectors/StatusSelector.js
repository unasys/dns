import React, { Component } from 'react';
import './StatusSelector.scss';

class StatusSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            statuses: [
                { name: "Operational", id: 0 },
                { name: "Removed", id: 1 },
                { name: "Redundant", id: 2 },
                { name: "Passive", id: 3 },
                { name: "Shutdown", id: 4 },
                { name: "Decomissioned", id: 4 }]
        }
    }

    render() {
        let statuses = (
            this.state.statuses.map(status => {
                return (
                    <div key={status.name}>
                        <div
                            className={'status ' + (this.props.selectedStatus === status ? 'selected' : '')}
                            onClick={this.props.onStatusSelect.bind(this, status)}>
                            {status.name}
                        </div>
                    </div>)
            }))

        return (
            <div>
                {(statuses.length === 0) ? <div>No results.</div> :
                    <div className="status-container">
                        {statuses}
                    </div>}
            </div>);
    }
}

export default StatusSelector;
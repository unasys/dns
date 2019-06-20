import React, { Component } from 'react';
import './CriticalitySelector.scss';

class CriticalitySelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            criticalities: [
                { name: "Class", id: 0 },
                { name: "Safety", id: 1 },
                { name: "Production", id: 2 },
                { name: "Structural", id: 3 },
                { name: "None", id: 4 }],
        }
    }

    render() {
        let criticalities = (
            this.state.criticalities.map(critical => {
                return (
                    <div key={critical.name}>
                        <div
                            className={'critical ' + (this.props.selectedCriticality === critical ? 'selected' : '')}
                            onClick={this.props.onCriticalSelect.bind(this, critical)}>
                            {critical.name}
                        </div>
                    </div>)
            }))

        return (
            <div>
                {(criticalities.length === 0) ? <div>No results.</div> :
                    <div className="criticality-container">
                        {criticalities}
                    </div>}
            </div>);
    }
}

export default CriticalitySelector;
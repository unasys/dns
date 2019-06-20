import React, { Component } from 'react';
import './ConditionSelector.scss';

class ConditionSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            conditions: [
                { name: "Very Good", id: 0, colour: "#38ea5e" },
                { name: "Good", id: 1, colour: "#5BEA55" },
                { name: "Moderate", id: 2, colour: "#ffb660" },
                { name: "Poor", id: 3, colour: "#ea7467" },
                { name: "Very Poor", id: 4, colour: "#ce0000" }],
        }
    }

    render() {
        let conditions = (
            this.state.conditions.map(condition => {
                return (
                    <div key={condition.name}>
                        <div
                            className={'condition ' + (this.props.selectedCondition === condition ? 'selected' : '')}
                            onClick={this.props.onConditionSelect.bind(this, condition)}
                            style={{ background: condition.colour }}>
                            {condition.name}
                        </div>
                    </div>)
            }))

        return (
            <div>
                {(conditions.length === 0) ? <div>No results.</div> :
                    <div className="condition-container">
                        {conditions}
                    </div>}
            </div>);
    }
}

export default ConditionSelector;
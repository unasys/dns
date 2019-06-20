import React, { Component } from 'react';
import axios from 'axios';
import '../WeightsAndMaterials.scss';
import MaterialBreakdown from './MaterialBreakdown';
import { numberWithCommas } from '../Utils';


class Weights extends Component {
    constructor(props) {
        super(props);
        this.state = {
            breakdown: null
        }
    }


    componentDidMount() {
        axios.get(`/projects/${this.props.projectId}/materials`)
            .then(payload => {
                this.setState({
                    breakdown: payload.data.breakdown
            })})
    }

    render () {
        const breakdown = this.state.breakdown;

        if (breakdown === null) {
            return <div>No breakdown found.</div>
        }

        let types = [];
        let totalWeight = breakdown.reduce(function (a, b) {return a + b.weight}, 0);

        breakdown.forEach((componentBreakdown, i) => {
            var type = {
                type: componentBreakdown.name,
                percent: componentBreakdown.weight,
                subs : componentBreakdown.breakdown.map(item => {
                        return {name: item.name, weight: numberWithCommas(item.weight)};
                    })
                }
            types.push(type);
        })

        return (
                <div>
                <h1 className="breakdown-title title">
                    Materials
                </h1>
                <h2 className="breakdown-subtitle subtitle">Total weight: {numberWithCommas(totalWeight)} tonnes</h2>
                     <MaterialBreakdown types={types}></MaterialBreakdown>
                </div>
            )

    }
}

export default Weights;
import React, { Component } from 'react';
import axios from 'axios';
import '../WeightsAndMaterials.scss';
import WeightBreakdown from './WeightBreakdown';
import { numberWithCommas } from '../Utils';


class Weights extends Component {
    constructor(props) {
        super(props);
        this.state = {
            breakdownInfo: null,
            currentBreakdown:null 
        }
    }

    componentDidMount() {
        axios.get(`/projects/${this.props.projectId}/weights`)
            .then(payload => {
                this.setState({
                    breakdownInfo: payload.data.breakdown
            })})
    }

    prepareBreakdownSegments(breakdown) {
        let types = [];
        
        breakdown.forEach((componentBreakdown, i) => {
            var type = {
                type: componentBreakdown.name,
                percent: componentBreakdown.weight,
                subs : componentBreakdown.breakdown.map(item => {
                    return {name: item.name, weight: numberWithCommas(item.weight), breakdown: item.breakdown};
                })
            }
            types.push(type);
        })
        return types;
    }
    
    render () {
        const breakdown = this.state.breakdownInfo;
        
        if (breakdown === null) {
            return <div>No breakdown found.</div>
        }
        
        let totalWeight = breakdown.reduce(function (a, b) {return a + b.weight}, 0);
        let types = this.prepareBreakdownSegments(breakdown);
        return (
            <div>
                <h1 className="breakdown-title title">
                    Weights
                </h1>
                <h2 className="breakdown-subtitle subtitle">Total weight: {numberWithCommas(totalWeight)} tonnes</h2>
                <WeightBreakdown types={types}></WeightBreakdown>
            </div>
        );
    }
}

export default Weights;
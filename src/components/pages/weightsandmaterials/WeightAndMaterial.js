import React, { Component } from 'react';
import Weights from './weights/Weights';
import Materials from './materials/Materials';

class WeightAndMaterial extends Component {
    render() {
        const projectId = this.props.match.params.currentProjectId;
        return (
            <div className="weights-and-materials-container">
                <div className="left-column">
                    <Weights projectId={projectId}></Weights>
                </div>
                <div className="right-column">
                    <Materials projectId={projectId}></Materials>
                </div>
            </div>
        )
    }
}

export default WeightAndMaterial;


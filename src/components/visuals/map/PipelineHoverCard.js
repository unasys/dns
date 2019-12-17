import React, { Component } from 'react';

class PipelineHoverCard extends Component {
    render() {
        const { hoveredPipeline } = this.props;

        if (!hoveredPipeline) {
            return <div></div>;
        }

        return (
            <div className="installation-hover-card" style={{ top: this.props.position.y, left: this.props.position.x }}>
                <div className="installation-hover-card-title">
                    <div className="installation-text-value">
                        <div className="installation-hover-card-heading">Name</div>
                        <div className="installation-hover-card-value">{hoveredPipeline["Pipeline Name"]}</div>
                    </div>
                </div>
                <div className="installation-hover-card-body">
                    <div className="text-block-container">
                        <div className="installation-text-value">
                            <div className="installation-hover-card-heading">Fluid Conveyed</div>
                            <div className="installation-hover-card-value">{hoveredPipeline["Fluid Conveyed"]}</div>
                        </div>
                        <div className="installation-text-value">
                            <div className="installation-hover-card-heading">Pipeline DTI No</div>
                            <div className="installation-hover-card-value">{hoveredPipeline["Pipeline DTI No"]}</div>
                        </div>
                    </div>
                    <div className="text-block-container">
                        <div className="installation-text-value">
                            <div className="installation-hover-card-heading">Status</div>
                            <div className="installation-hover-card-value">{hoveredPipeline["Status"]}</div>
                        </div>
                        <div className="installation-text-value">
                            <div className="installation-hover-card-heading">Inst Type</div>
                            <div className="installation-hover-card-value">{hoveredPipeline["Inst Type"]}</div>
                        </div>
                        <div className="installation-text-value">
                            <div className="installation-hover-card-heading">Operator</div>
                            <div className="installation-hover-card-value">{hoveredPipeline["Operator"]}</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default PipelineHoverCard;
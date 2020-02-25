import React, { Component } from 'react';

class PipelineHoverCard extends Component {
    render() {
        const { hoveredPipeline } = this.props;

        if (!hoveredPipeline) {
            return <div></div>;
        }

        return (
            <div className="hover-card" style={{ top: this.props.position.y, left: this.props.position.x }}>
                <div className="hover-card-title">
                    <div className="hover-text-value">
                        <div className="hover-card-heading">Name</div>
                        <div className="hover-card-value">{hoveredPipeline["Pipeline Name"]}</div>
                    </div>
                </div>
                <div className="hover-card-body">
                    <div className="text-block-container">
                        <div className="hover-text-value">
                            <div className="hover-card-heading">Fluid Conveyed</div>
                            <div className="hover-card-value">{hoveredPipeline["Fluid Conveyed"]}</div>
                        </div>
                        <div className="hover-text-value">
                            <div className="hover-card-heading">Pipeline DTI No</div>
                            <div className="hover-card-value">{hoveredPipeline["Pipeline DTI No"]}</div>
                        </div>
                    </div>
                    <div className="text-block-container">
                        <div className="hover-text-value">
                            <div className="hover-card-heading">Status</div>
                            <div className="hover-card-value">{hoveredPipeline["Status"]}</div>
                        </div>
                        <div className="hover-text-value">
                            <div className="hover-card-heading">Inst Type</div>
                            <div className="hover-card-value">{hoveredPipeline["Inst Type"]}</div>
                        </div>
                        <div className="hover-text-value">
                            <div className="hover-card-heading">Operator</div>
                            <div className="hover-card-value">{hoveredPipeline["Operator"]}</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default PipelineHoverCard;
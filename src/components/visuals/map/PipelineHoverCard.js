import React, { Component } from 'react';

class PipelineHoverCard extends Component {
    render() {
        const { hoveredPipeline } = this.props;

        if (!hoveredPipeline) {
            return <div></div>;
        }

        console.log(hoveredPipeline);
        
        return (
            <div className="installation-hover-card" style={{top: this.props.position.y, left: this.props.position.x}}>
                <div className="installation-hover-card-title">
                    <div className="installation-text-value">
                        <div className="installation-hover-card-heading">Name</div>
                        <div className="installation-hover-card-value">{hoveredPipeline["Pipeline Name"]}</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default PipelineHoverCard;
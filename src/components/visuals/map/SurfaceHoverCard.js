import React, { Component } from 'react';

class SurfaceHoverCard extends Component {
    render() {
        const { hoveredSurface } = this.props;

        if (!hoveredSurface) {
            return <div></div>;
        }
        
        return (
            <div className="installation-hover-card" style={{top: this.props.position.y, left: this.props.position.x}}>
                <div className="installation-hover-card-title">
                    <div className="installation-text-value">
                        <div className="installation-hover-card-heading">Name</div>
                        <div className="installation-hover-card-value">{hoveredSurface.name}</div>
                    </div>
                </div>
                <div className="installation-hover-card-body">
                    <div className="text-block-container">
                        <div className="installation-text-value">
                            <div className="installation-hover-card-heading">Operator</div>
                            <div className="installation-hover-card-value">{hoveredSurface.operator}</div>
                        </div>
                        <div className="installation-text-value">
                            <div className="installation-hover-card-heading">Type</div>
                            <div className="installation-hover-card-value">{hoveredSurface.type}</div>
                        </div>
                    </div>
                    <div className="text-block-container">
                        <div className="installation-text-value">
                            <div className="installation-hover-card-heading">Status</div>
                            <div className="installation-hover-card-value">{hoveredSurface.status}</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default SurfaceHoverCard;
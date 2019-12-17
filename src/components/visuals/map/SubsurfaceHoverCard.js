import React, { Component } from 'react';

class SubsurfaceHoverCard extends Component {
    render() {
        const { hoveredSurface: hoveredSubsurface } = this.props;

        if (!hoveredSubsurface) {
            return <div></div>;
        }
        
        return (
            <div className="installation-hover-card" style={{top: this.props.position.y, left: this.props.position.x}}>
                <div className="installation-hover-card-title">
                    <div className="installation-text-value">
                        <div className="installation-hover-card-heading">Name</div>
                        <div className="installation-hover-card-value">{hoveredSubsurface.name}</div>
                    </div>
                </div>
                <div className="installation-hover-card-body">
                    <div className="text-block-container">
                        <div className="installation-text-value">
                            <div className="installation-hover-card-heading">Operator</div>
                            <div className="installation-hover-card-value">{hoveredSubsurface.operator}</div>
                        </div>
                        <div className="installation-text-value">
                            <div className="installation-hover-card-heading">Type</div>
                            <div className="installation-hover-card-value">{hoveredSubsurface.type}</div>
                        </div>
                    </div>
                    <div className="text-block-container">
                        <div className="installation-text-value">
                            <div className="installation-hover-card-heading">Status</div>
                            <div className="installation-hover-card-value">{hoveredSubsurface.status}</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default SubsurfaceHoverCard;
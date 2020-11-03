import React, { Component } from 'react';

class SubsurfaceHoverCard extends Component {
    render() {
        const { hoveredSubsurface } = this.props;

        if (!hoveredSubsurface) {
            return <div></div>;
        }
        
        return (
            <div className="hover-card" style={{top: this.props.position.y, left: this.props.position.x}}>
                <div className="hover-card-title">
                    <div className="hover-text-value">
                        <div className="hover-card-heading">Name</div>
                        <div className="hover-card-value">{hoveredSubsurface.name}</div>
                    </div>
                </div>
                <div className="hover-card-body">
                    <div className="text-block-container">
                        <div className="hover-text-value">
                            <div className="hover-card-heading">Operator</div>
                            <div className="hover-card-value">{hoveredSubsurface.operator}</div>
                        </div>
                        <div className="hover-text-value">
                            <div className="hover-card-heading">Type</div>
                            <div className="hover-card-value">{hoveredSubsurface.type}</div>
                        </div>
                    </div>
                    <div className="text-block-container">
                        <div className="hover-text-value">
                            <div className="hover-card-heading">Status</div>
                            <div className="hover-card-value">{hoveredSubsurface.status}</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default SubsurfaceHoverCard;
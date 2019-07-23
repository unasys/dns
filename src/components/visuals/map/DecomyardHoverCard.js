import React, { Component } from 'react';

class DecomyardHoverCard extends Component {
    render() {
        const { hoveredDecomyard } = this.props;

        if (!hoveredDecomyard) {
            return <div></div>;
        }
        
        return (
            <div className="installation-hover-card" style={{top: this.props.position.y, left: this.props.position.x}}>
                <div className="installation-hover-card-title">
                    <div className="installation-text-value">
                        <div className="installation-hover-card-heading">Name</div>
                        <div className="installation-hover-card-value">{hoveredDecomyard["Name"]}</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default DecomyardHoverCard;
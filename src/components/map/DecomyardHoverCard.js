import React, { Component } from 'react';

class DecomyardHoverCard extends Component {
    render() {
        const { hoveredDecomyard } = this.props;

        if (!hoveredDecomyard) {
            return <div></div>;
        }
        
        return (
            <div className="hover-card" style={{top: this.props.position.y, left: this.props.position.x}}>
                <div className="hover-card-title">
                    <div className="hover-text-value">
                        <div className="hover-card-heading">Name</div>
                        <div className="hover-card-value">{hoveredDecomyard["Name"]}</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default DecomyardHoverCard;
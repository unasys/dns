import React, { Component } from 'react';

class FieldHoverCard extends Component {
    render() {
        const { hoveredField } = this.props;

        if (!hoveredField) {
            return <div></div>;
        }
        
        return (
            <div className="installation-hover-card" style={{top: this.props.position.y, left: this.props.position.x}}>
                <div className="installation-hover-card-title">
                    <div className="installation-text-value">
                        <div className="installation-hover-card-heading">Name</div>
                        <div className="installation-hover-card-value">{hoveredField["Field Name"]}</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default FieldHoverCard;
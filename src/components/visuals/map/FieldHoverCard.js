import React, { Component } from 'react';

class FieldHoverCard extends Component {
    render() {
        const { hoveredField } = this.props;

        if (!hoveredField) {
            return <div></div>;
        }
        
        return (
            <div className="hover-card" style={{top: this.props.position.y, left: this.props.position.x}}>
                <div className="hover-card-title">
                    <div className="hover-text-value">
                        <div className="hover-card-heading">Name</div>
                        <div className="hover-card-value">{hoveredField["Field Name"]}</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default FieldHoverCard;
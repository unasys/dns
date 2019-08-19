import React, { Component } from 'react';

class WindfarmHoverCard extends Component {
    render() {
        const { hoveredWindfarm } = this.props;

        if (!hoveredWindfarm) {
            return <div></div>;
        }
        
        return (
            <div className="installation-hover-card" style={{top: this.props.position.y, left: this.props.position.x}}>
                <div className="installation-hover-card-title">
                    <div className="installation-text-value">
                        <div className="installation-hover-card-heading">Name</div>
                        <div className="installation-hover-card-value">{hoveredWindfarm["NAME"]}</div>
                    </div>
                </div>
                <div className="installation-hover-card-body">
                <div className="text-block-container">                    
                        <div className="installation-text-value">
                            <div className="installation-hover-card-heading">Build Cost</div>
                            <div className="installation-hover-card-value">{hoveredWindfarm["BUILD COST"]}</div>
                        </div>
                </div>
                <div className="text-block-container">                    
                        <div className="installation-text-value">
                            <div className="installation-hover-card-heading">Turbines</div>
                            <div className="installation-hover-card-value">{hoveredWindfarm["TURBINES"]}</div>
                        </div>
                        <div className="installation-text-value">
                            <div className="installation-hover-card-heading">Capacity Factor</div>
                            <div className="installation-hover-card-value">{hoveredWindfarm["CAPACITY FACTOR"]}</div>
                        </div>
                        <div className="installation-text-value">
                            <div className="installation-hover-card-heading">Commisioning Date</div>
                            <div className="installation-hover-card-value">{hoveredWindfarm["COMMISSIONING DATE"]}</div>
                        </div>
                        </div>
                </div>
            </div>
        )
    }
}

export default WindfarmHoverCard;


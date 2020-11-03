import React, { Component } from 'react';

class WindfarmHoverCard extends Component {
    render() {
        const { hoveredWindfarm } = this.props;

        if (!hoveredWindfarm) {
            return <div></div>;
        }
        
        return (
            <div className="hover-card" style={{top: this.props.position.y, left: this.props.position.x}}>
                <div className="hover-card-title">
                    <div className="hover-text-value">
                        <div className="hover-card-heading">Name</div>
                        <div className="hover-card-value">{hoveredWindfarm["NAME"]}</div>
                    </div>
                </div>
                <div className="hover-card-body">
                <div className="text-block-container">                    
                        <div className="hover-text-value">
                            <div className="hover-card-heading">Build Cost</div>
                            <div className="hover-card-value">{hoveredWindfarm["BUILD COST"]}</div>
                        </div>
                </div>
                <div className="text-block-container">                    
                        <div className="hover-text-value">
                            <div className="hover-card-heading">Turbines</div>
                            <div className="hover-card-value">{hoveredWindfarm["TURBINES"]}</div>
                        </div>
                        <div className="hover-text-value">
                            <div className="hover-card-heading">Capacity Factor</div>
                            <div className="hover-card-value">{hoveredWindfarm["CAPACITY FACTOR"]}</div>
                        </div>
                        <div className="hover-text-value">
                            <div className="hover-card-heading">Commisioning Date</div>
                            <div className="hover-card-value">{hoveredWindfarm["COMMISSIONING DATE"]}</div>
                        </div>
                        </div>
                </div>
            </div>
        )
    }
}

export default WindfarmHoverCard;


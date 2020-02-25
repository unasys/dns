import React, { Component } from 'react';

class InstallationHoverCard extends Component {
    render() {
        const { hoveredInstallation } = this.props;

        if (!hoveredInstallation) {
            return <div></div>;
        }
        
        return (
            <div className="hover-card" style={{top: this.props.position.y, left: this.props.position.x}}>
                <div className="hover-card-title">
                    <div className="hover-text-value">
                        <div className="hover-card-heading">Field Type</div>
                        <div className="hover-card-value">{hoveredInstallation["FieldType"]}</div>
                    </div>
                </div>
                <div className="hover-card-body">
                    <div className="image-block-container">                    
                            <div className="image">
                                {hoveredInstallation["ImageID"] ? <img src={`https://assets.digitalnorthsea.com/images/installations/${hoveredInstallation["ImageID"]}`} alt="overview-thumbnail" ></img> : <img src={`https://assets.digitalnorthsea.com/images/installations/-1.jpg`} alt="overview-thumbnail" ></img>}
                            </div>
                        <div className="text-block">
                            <div className="hover-text-value">
                                <div className="hover-card-heading">Installation Name</div>
                                <div className="hover-card-value">{hoveredInstallation["Name"]}</div>
                            </div>
                            <div className="hover-text-value">
                                <div className="hover-card-heading">Block Number</div>
                                <div className="hover-card-value">{hoveredInstallation["Block"]}</div>
                            </div>
                        </div>
                    </div>
                    <div className="text-block-container">
                        <div className="hover-text-value">
                            <div className="hover-card-heading">Installation Type</div>
                            <div className="hover-card-value">{hoveredInstallation["Type"]}</div>
                        </div>
                        <div className="hover-text-value">
                            <div className="hover-card-heading">Operator</div>
                            <div className="hover-card-value">{hoveredInstallation["Operator"]}</div>
                        </div>
                    </div>
                        <div className="text-block">
                            <div className="hover-text-value">
                                <div className="hover-card-heading">Area</div>
                                <div className="hover-card-value">{hoveredInstallation["Area"]}</div>
                            </div>
                            <div className="hover-text-value">
                                <div className="hover-card-heading">First Oil/Gas Date</div>
                                <div className="hover-card-value">{hoveredInstallation["StartDate"]}</div>
                            </div>
                        </div>
                    
                </div>
            </div>
        )
    }
}

export default InstallationHoverCard;
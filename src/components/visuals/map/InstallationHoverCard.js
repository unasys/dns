import React, { Component } from 'react';

class InstallationHoverCard extends Component {
    render() {
        const { hoveredInstallation } = this.props;

        if (!hoveredInstallation) {
            return <div></div>;
        }
        
        return (
            <div className="installation-hover-card" style={{top: this.props.position.y, left: this.props.position.x}}>
                <div className="installation-hover-card-title">
                    <div className="installation-text-value">
                        <div className="installation-hover-card-heading">Field Type</div>
                        <div className="installation-hover-card-value">{hoveredInstallation["Type of Fluid"]}</div>
                    </div>
                </div>
                <div className="installation-hover-card-body">
                    <div className="image-block-container">                    
                        {hoveredInstallation["Image ID"] &&
                            <div className="image">
                                    <img src={`https://epmdata.blob.core.windows.net/assets/images/${hoveredInstallation["Image ID"]}.jpg`} alt="overview-thumbnail" ></img>
                            </div>}
                        <div className="text-block">
                            <div className="installation-text-value">
                                <div className="installation-hover-card-heading">Installation Name</div>
                                <div className="installation-hover-card-value">{hoveredInstallation["Facility Name"]}</div>
                            </div>
                            <div className="installation-text-value">
                                <div className="installation-hover-card-heading">Quadrant Number</div>
                                <div className="installation-hover-card-value">{hoveredInstallation["Quadrant Number"]}</div>
                            </div>
                        </div>
                    </div>
                    <div className="text-block-container">
                        <div className="installation-text-value">
                            <div className="installation-hover-card-heading">Installation Type</div>
                            <div className="installation-hover-card-value">{hoveredInstallation["Facility Type Description"]}</div>
                        </div>
                    </div>
                    <div className="image-block-container">
                        {/* <div className="image">
                            <div style={{ height: '50px', width: '50px', backgroundColor: 'yellow', borderRadius: '10px' }}>
                            </div>
                        </div> */}
                        <div className="text-block">
                            <div className="installation-text-value">
                                <div className="installation-hover-card-heading">Area</div>
                                <div className="installation-hover-card-value">{hoveredInstallation["Area"]}</div>
                            </div>
                            <div className="installation-text-value">
                                <div className="installation-hover-card-heading">First Oil/Gas Date</div>
                                <div className="installation-hover-card-value">{hoveredInstallation["First Oil/Gas Date"]}</div>
                            </div>
                            <div className="installation-text-value">
                                <div className="installation-hover-card-heading">Manned or NUI</div>
                                <div className="installation-hover-card-value">{hoveredInstallation["Manned or NUI"]}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default InstallationHoverCard;
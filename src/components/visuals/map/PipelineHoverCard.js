import React, { Component } from 'react';

class PipelineHoverCard extends Component {
    render() {
        const { hoveredPipeline } = this.props;

        if (!hoveredPipeline) {
            return <div></div>;
        }
        
        return (
            <div className="installation-hover-card" style={{top: this.props.position.y, left: this.props.position.x}}>
                <div className="installation-hover-card-title">
                    <div className="installation-text-value">
                        <div className="installation-hover-card-heading">Name</div>
                        <div className="installation-hover-card-value">{hoveredPipeline["Pipeline Name"]}</div>
                    </div>
                </div> <div className="installation-hover-card-body">
                <div className="text-block-container">                    
                        <div className="installation-text-value">
                            <div className="installation-hover-card-heading">Fluid Conveyed</div>
                            <div className="installation-hover-card-value">{hoveredPipeline["Fluid Conveyed"]}</div>
                        </div>
                </div>
                <div className="text-block-container">                    
                        <div className="installation-text-value">
                            <div className="installation-hover-card-heading">Status</div>
                            <div className="installation-hover-card-value">{hoveredPipeline["Status"]}</div>
                        </div>
                        <div className="installation-text-value">
                            <div className="installation-hover-card-heading">Inst Type</div>
                            <div className="installation-hover-card-value">{hoveredPipeline["Inst Type"]}</div>
                        </div>
                        <div className="installation-text-value">
                            <div className="installation-hover-card-heading">Operator</div>
                            <div className="installation-hover-card-value">{hoveredPipeline["Operator"]}</div>
                        </div>
                        </div>
                </div>
            </div>
        )
    }
}

export default PipelineHoverCard;


{/* <div className="installation-hover-card" style={{top: this.props.position.y, left: this.props.position.x}}>
<div className="installation-hover-card-title">
    <div className="installation-text-value">
        <div className="installation-hover-card-heading">Field Type</div>
        <div className="installation-hover-card-value">{hoveredInstallation["FieldType"]}</div>
    </div>
</div>
<div className="installation-hover-card-body">
    <div className="image-block-container">                    
            <div className="image">
                    {hoveredInstallation["ImageID"] ? <img src={`https://assets.digitalnorthsea.com/images/installations/${hoveredInstallation["ImageID"]}`} alt="overview-thumbnail" ></img> : <img src={`https://assets.digitalnorthsea.com/images/installations/-1.jpg`} alt="overview-thumbnail" ></img>}
            </div>
        <div className="text-block">
            <div className="installation-text-value">
                <div className="installation-hover-card-heading">Installation Name</div>
                <div className="installation-hover-card-value">{hoveredInstallation["Name"]}</div>
            </div>
            <div className="installation-text-value">
                <div className="installation-hover-card-heading">Block Number</div>
                <div className="installation-hover-card-value">{hoveredInstallation["Block"]}</div>
            </div>
        </div>
    </div> */}
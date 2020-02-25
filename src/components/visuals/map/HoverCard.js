import React from 'react';
import InstallationHoverCard from "./InstallationHoverCard"
import PipelineHoverCard from "./PipelineHoverCard"
import DecomyardHoverCard from "./DecomyardHoverCard"
import FieldHoverCard from "./FieldHoverCard"
import WindfarmHoverCard from "./WindfarmHoverCard"
import SubsurfaceHoverCard from "./SubsurfaceHoverCard"

const DataDrivenValue = ({ value }) => {
    return (
        <div key={value.name} className="hover-text-value">
            <div className="hover-card-heading">{value.name}</div>
            <div className="hover-card-value">{value.values}</div>
        </div>
    );
}

const DataDrivenHoverCard = ({ name, hoverDetails, position }) => {
    const detailContainers = hoverDetails.map(c => <div key={c.name} className="text-block-container">{c.values.map(v => <DataDrivenValue key={v.name} value={v} />)}</div>);
    return (
        <div className="hover-card" style={{ top: position.y, left: position.x }}>
            <div className="hover-card-title">
                <div className="hover-text-value">
                    <div className="hover-card-heading">Name</div>
                    <div className="hover-card-value">{name}</div>
                </div>
            </div>

            <div className="hover-card-body">
                {detailContainers}
            </div>
        </div>
    )
}

const HoverCard = (props) => {
    if (props.entity?.Hover) {
        return <DataDrivenHoverCard position={props.position} hoverDetails={props.entity.Hover} name={props.entity.name} />
    }

    switch (props.type) {
        case "Installation":
            return <InstallationHoverCard position={props.position} hoveredInstallation={props.entity} />
        case "Pipeline":
            return <PipelineHoverCard position={props.position} hoveredPipeline={props.entity} />
        case "DecomYard":
            return <DecomyardHoverCard position={props.position} hoveredDecomyard={props.entity} />
        case "Field":
            return <FieldHoverCard position={props.position} hoveredField={props.entity} />
        case "Windfarm":
            return <WindfarmHoverCard position={props.position} hoveredWindfarm={props.entity} />
        case "Subsurface":
            return <SubsurfaceHoverCard position={props.position} hoveredSubsurface={props.entity} />
        default:
            return <></>
    }
}

export default HoverCard;
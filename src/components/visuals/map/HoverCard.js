import React from 'react';
import InstallationHoverCard from "./InstallationHoverCard"
import PipelineHoverCard from "./PipelineHoverCard"
import DecomyardHoverCard from "./DecomyardHoverCard"
import FieldHoverCard from "./FieldHoverCard"
import WindfarmHoverCard from "./WindfarmHoverCard"
import SurfaceHoverCard from "./SurfaceHoverCard"

const HoverCard = (props) => {
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
        case "Surface":
            return <SurfaceHoverCard position={props.position} hoveredSurface={props.entity} />
        default:
            return <></>
    }
}

export default HoverCard;
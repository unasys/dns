import { CallbackProperty, Cartesian3, Color, CustomDataSource, DistanceDisplayCondition,  HeightReference, NearFarScalar } from "cesium";
import { useEffect, useRef } from "react";
import { useStateValue } from "../../utils/state";

let heightReference = HeightReference.NONE;
const dynamicHeightReference = new CallbackProperty(function () {
    return heightReference;
}, false);

const mapSubsurface = (subsurface) => {
    const position = Cartesian3.fromDegrees(subsurface.coordinates[0], subsurface.coordinates[1]);
    const point = {
        pixelSize: 4,
        color: Color.MINTCREAM,
        eyeOffset: new Cartesian3(0, 0, 1),
        distanceDisplayCondition: new DistanceDisplayCondition(0.0, 8500009.5),
        translucencyByDistance: new NearFarScalar(2300009.5, 1, 8500009.5, 0.01),
        heightReference: dynamicHeightReference,
        zIndex: 50
    };

    return {
        id: subsurface.id,
        name: subsurface.name,
        position: position,
        point: point,
        originalData: subsurface
    }
}

async function setupSubsurfaces(subsurfaces, dataSource, visibleEntities) {
    subsurfaces.forEach(i => dataSource.entities.add(mapSubsurface(i)));
}

export function useSubsurfaces({ requestRender }) {
    const [{ subsurfaces, showSubsurfaces, subsurfacesVisible, enableTerrain },] = useStateValue();
    const dataSource = useRef(new CustomDataSource("Subsurface"));
    const visibleEntities = useRef(new Set());
    useEffect(() => {
        dataSource.current.entities.removeAll();
        setupSubsurfaces(subsurfaces, dataSource.current, visibleEntities);
    }, [subsurfaces]);

    useEffect(() => {
        dataSource.current.show = showSubsurfaces;
        requestRender();
    }, [showSubsurfaces, requestRender]);

    useEffect(() => {
        visibleEntities.current.clear();
        if (subsurfacesVisible) {
            subsurfacesVisible.forEach(id => visibleEntities.current.add(id));
        }
    }, [subsurfacesVisible]);

    useEffect(() => {
        if (enableTerrain) {
            heightReference = HeightReference.CLAMP_TO_GROUND;
        } else {
            heightReference = HeightReference.NONE;
        }
    }, [enableTerrain]);

    return dataSource.current;
}
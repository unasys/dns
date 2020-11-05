import { CallbackProperty, Color, DistanceDisplayCondition, GeoJsonDataSource, HeightReference, NearFarScalar, PointGraphics } from "cesium";
import { useEffect, useRef } from "react";
import { useStateValue } from "../../utils/state";

let heightReference = HeightReference.NONE;
const dynamicHeightReference = new CallbackProperty(function () {
    return heightReference;
}, false);

async function setupWells(wells, dataSource, visibleEntities) {
    const features = [...wells.values()].map(well => ({ type: "Feature", id: well.id, name: well.name, geometry: well.Geometry, properties: { id: well.id } }));
    const geoJson = { type: "FeatureCollection", features: features };
    await dataSource.load(geoJson);
    const p = dataSource.entities.values;
    for (let i = 0; i < p.length; i++) {
        const entity = p[i];
        if (entity.billboard) {
            entity.billboard = undefined;
            entity.point = new PointGraphics({
                pixelSize: 4,
                color: Color.BLACK,
                distanceDisplayCondition: new DistanceDisplayCondition(0.0, 8500009.5),
                translucencyByDistance: new NearFarScalar(2300009.5, 1, 8500009.5, 0.01),
                heightReference: dynamicHeightReference,
                zIndex: 50
            });
        }

        const rawEntity = wells.get(entity.properties.id.getValue().toString());
        if (rawEntity) {
            entity.originalData = rawEntity;
        }
    }
}

export function useWells({ requestRender }) {
    const [{ wells, showWells, wellsVisible, enableTerrain },] = useStateValue();
    const dataSource = useRef(new GeoJsonDataSource("Well"));
    const visibleEntities = useRef(new Set());
    useEffect(() => {
        dataSource.current.entities.removeAll();
        setupWells(wells, dataSource.current, visibleEntities);
    }, [wells]);

    useEffect(() => {
        dataSource.current.show = showWells;
        requestRender();
    }, [showWells, requestRender]);

    useEffect(() => {
        visibleEntities.current.clear();
        if (wellsVisible) {
            wellsVisible.forEach(id => visibleEntities.current.add(id));
        }
    }, [wellsVisible]);

    useEffect(() => {
        if (enableTerrain) {
            heightReference = HeightReference.CLAMP_TO_GROUND;
        } else {
            heightReference = HeightReference.NONE;
        }
    }, [enableTerrain]);

    return dataSource.current;
}
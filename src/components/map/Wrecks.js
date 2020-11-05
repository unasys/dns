import { CallbackProperty, Color, DistanceDisplayCondition, GeoJsonDataSource, HeightReference, NearFarScalar, PointGraphics } from "cesium";
import { useEffect, useRef } from "react";
import { useStateValue } from "../../utils/state";

let heightReference = HeightReference.NONE;
const dynamicHeightReference = new CallbackProperty(function () {
    return heightReference;
}, false);

async function setupWrecks(wrecks, dataSource, visibleEntities) {
    const features = [...wrecks.values()].map(wreck => ({ type: "Feature", id: wreck.id, name: wreck.name, geometry: wreck.Geometry, properties: { id: wreck.id } }));
    const geoJson = { type: "FeatureCollection", features: features };
    await dataSource.load(geoJson);
    const p = dataSource.entities.values;
    for (let i = 0; i < p.length; i++) {
        const entity = p[i];
        if (entity.billboard) {
            entity.billboard = undefined;
            entity.point = new PointGraphics({
                pixelSize: 4,
                color: Color.SLATEGREY,
                distanceDisplayCondition: new DistanceDisplayCondition(0.0, 8500009.5),
                translucencyByDistance: new NearFarScalar(2300009.5, 1, 8500009.5, 0.01),
                heightReference: dynamicHeightReference,
                zIndex: 50
            });
        }
        const rawEntity = wrecks.get(entity.properties.id.getValue().toString());
        if (rawEntity) {
            entity.originalData = rawEntity;
        }

    }
}

export function useWrecks({ requestRender }) {
    const [{ wrecks, showWrecks, wrecksVisible, enableTerrain },] = useStateValue();
    const dataSource = useRef(new GeoJsonDataSource("Wreck"));
    const visibleEntities = useRef(new Set());
    useEffect(() => {
        dataSource.current.entities.removeAll();
        setupWrecks(wrecks, dataSource.current, visibleEntities);
    }, [wrecks]);

    useEffect(() => {
        dataSource.current.show = showWrecks;
        requestRender();
    }, [showWrecks, requestRender]);

    useEffect(() => {
        visibleEntities.current.clear();
        if (wrecksVisible) {
            wrecksVisible.forEach(id => visibleEntities.current.add(id));
        }
    }, [wrecksVisible]);

    useEffect(() => {
        if (enableTerrain) {
            heightReference = HeightReference.CLAMP_TO_GROUND;
        } else {
            heightReference = HeightReference.NONE;
        }
    }, [enableTerrain]);


    return dataSource.current;
}
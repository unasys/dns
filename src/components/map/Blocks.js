import { BoundingSphere, CallbackProperty, Color, ConstantPositionProperty, DistanceDisplayCondition, Ellipsoid, GeoJsonDataSource, HeightReference, LabelGraphics, LabelStyle, NearFarScalar } from "cesium";
import { useEffect, useRef } from "react";
import { useStateValue } from "../../utils/state";
let heightReference = HeightReference.NONE;
const dynamicHeightReference = new CallbackProperty(function () {
    return heightReference;
}, false);

async function setupBlocks(blocks, dataSource, visibleEntities) {
    const scale = new NearFarScalar(1.5e2, 1.5, 8.0e6, 0.0);
    const features = [...blocks.values()].map(block => ({ type: "Feature", id: block.id, name: block.name, geometry: block.Geometry, properties: { id: block.id } }));
    const geoJson = { type: "FeatureCollection", features: features };
    await dataSource.load(geoJson, {
        fill: Color.TRANSPARENT,
        stroke: Color.LIGHTCORAL
    });
    const p = dataSource.entities.values;
    for (let i = 0; i < p.length; i++) {
        let entity = p[i];
        let polygon = entity.polygon;
        if (polygon) {
            polygon.zIndex = 30;
            var center = BoundingSphere.fromPoints(entity.polygon.hierarchy.getValue().positions).center;
            Ellipsoid.WGS84.scaleToGeodeticSurface(center, center);
            entity.position = new ConstantPositionProperty(center);
        }
        entity.label = new LabelGraphics({
            text: entity.properties.ALL_LABELS,
            distanceDisplayCondition: new DistanceDisplayCondition(0.0, 400000),
            font: '20px Arial Narrow"',
            scaleByDistance: scale,
            fillColor: Color.BLACK,
            style: LabelStyle.FILL,
            outlineColor: Color.WHITE,
            outlineWidth: 1.5,

            heightReference: dynamicHeightReference,
            scale: 0.65,
            zIndex: 60
        });
    }
}

export function useBlocks({ requestRender }) {
    const [{ blocks, showBlocks, blocksVisible, enableTerrain },] = useStateValue();
    const dataSource = useRef(new GeoJsonDataSource("Block"));
    const visibleEntities = useRef(new Set());

    useEffect(() => {
        dataSource.current.entities.removeAll();
        setupBlocks(blocks, dataSource.current, visibleEntities);
    }, [blocks]);

    useEffect(() => {
        dataSource.current.show = showBlocks;
        requestRender();
    }, [showBlocks, requestRender]);

    useEffect(() => {
        if (enableTerrain) {
            heightReference = HeightReference.CLAMP_TO_GROUND;
        } else {
            heightReference = HeightReference.NONE;
        }
    }, [enableTerrain]);

    useEffect(() => {
        visibleEntities.current.clear();
        if (blocksVisible) {
            blocksVisible.forEach(id => visibleEntities.current.add(id));
        }
    }, [blocksVisible]);


    return dataSource.current;
}
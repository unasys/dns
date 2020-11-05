import { BoundingSphere, CallbackProperty, Cartesian2, Color, ConstantPositionProperty, DistanceDisplayCondition, Ellipsoid, GeoJsonDataSource, HeightReference, HorizontalOrigin, LabelGraphics, LabelStyle, NearFarScalar, VerticalOrigin } from "cesium";
import { useEffect, useRef } from "react";
import { useStateValue } from "../../utils/state";

let heightReference = HeightReference.NONE;
const dynamicHeightReference = new CallbackProperty(function () {
    return heightReference;
}, false);

async function setupBasins(basins, dataSource, visibleEntities) {
    let scale = new NearFarScalar(1.5e2, 1.5, 8.0e6, 0.0);
    const features = [...basins.values()].map(basin => ({ type: "Feature", id: basin.id, name: basin.name, geometry: basin.Geometry, properties: { id: basin.id } }));
    const geoJson = { type: "FeatureCollection", features: features };
    await dataSource.load(geoJson);
    const p = dataSource.entities.values;
    for (var i = 0; i < p.length; i++) {
        const entity = p[i];
        const rawEntity = basins.get(entity.properties.id.getValue().toString());
        if (rawEntity) {
            entity.originalData = rawEntity;
        }
        let polygon = entity.polygon;
        if (polygon) {
            polygon.zIndex = 20;
            if (rawEntity) {
                try {
                    const colour = Color.fromCssColorString(rawEntity.Colour);
                    polygon.material = colour.withAlpha(0.6);
                    polygon.outlineColor = colour;
                } catch (e) {
                }
            }
            var center = BoundingSphere.fromPoints(entity.polygon.hierarchy.getValue().positions).center;
            Ellipsoid.WGS84.scaleToGeodeticSurface(center, center);
            entity.position = new ConstantPositionProperty(center);
        }

        entity.label = new LabelGraphics({
            text: entity.name,
            distanceDisplayCondition: new DistanceDisplayCondition(0.0, 400000),
            font: '20px Arial Narrow"',
            scaleByDistance: scale,
            fillColor: Color.BLACK,
            style: LabelStyle.FILL,
            outlineColor: Color.WHITE,
            outlineWidth: 1.5,
            pixelOffset: new Cartesian2(25, 0),
            verticalOrigin: VerticalOrigin.CENTER,
            horizontalOrigin: HorizontalOrigin.LEFT,
            heightReference: dynamicHeightReference,
            scale: 0.65,
            zIndex: 60
        });
    }
}

export function useBasins({ requestRender }) {
    const [{ basins, showBasins, basinsVisible, enableTerrain },] = useStateValue();
    const dataSource = useRef(new GeoJsonDataSource("Basin"));
    const visibleEntities = useRef(new Set());
    useEffect(() => {
        dataSource.current.entities.removeAll();
        setupBasins(basins, dataSource.current, visibleEntities);
    }, [basins]);

    useEffect(() => {
        if (enableTerrain) {
            heightReference = HeightReference.CLAMP_TO_GROUND;
        } else {
            heightReference = HeightReference.NONE;
        }
    }, [enableTerrain]);

    useEffect(() => {
        dataSource.current.show = showBasins;
        requestRender();
    }, [showBasins, requestRender]);

    useEffect(() => {
        visibleEntities.current.clear();
        if (basinsVisible) {
            basinsVisible.forEach(id => visibleEntities.current.add(id));
        }
    }, [basinsVisible]);


    return dataSource.current;
}
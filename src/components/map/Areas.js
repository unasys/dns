import { BoundingSphere, CallbackProperty, Cartesian2, Color, ConstantPositionProperty, DistanceDisplayCondition, Ellipsoid, GeoJsonDataSource, HeightReference, HorizontalOrigin, LabelGraphics, LabelStyle, NearFarScalar, VerticalOrigin } from "cesium";
import { useEffect, useRef } from "react";
import { useStateValue } from "../../utils/state";

let heightReference = HeightReference.NONE;
const dynamicHeightReference = new CallbackProperty(function () {
    return heightReference;
}, false);

async function setupAreas(areas, dataSource, visibleEntities) {
    let scale = new NearFarScalar(1.5e2, 1.5, 8.0e6, 0.0);
    const features = [...areas.values()].map(area => ({ type: "Feature", id: area.id, name: area.name, geometry: area.Geometry, properties: { id: area.id } }));
    const geoJson = { type: "FeatureCollection", features: features };
    await dataSource.load(geoJson);
    const p = dataSource.entities.values;
    for (let i = 0; i < p.length; i++) {
        const entity = p[i];
        let polygon = entity.polygon;
        const rawEntity = areas.get(entity.properties.id.getValue().toString());
        if (rawEntity) {
            entity.originalData = rawEntity;
        }
        if (polygon) {
            polygon.zIndex = 1;
            if (rawEntity) {
                try {
                    const colour = Color.fromCssColorString(rawEntity.Colour);
                    polygon.material = colour.withAlpha(0.4);
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

export function useAreas({ requestRender }) {
    const [{ areas, showAreas, areasVisible, enableTerrain },] = useStateValue();
    const dataSource = useRef(new GeoJsonDataSource("Area"));
    const visibleEntities = useRef(new Set());
    useEffect(() => {
        dataSource.current.entities.removeAll();
        setupAreas(areas, dataSource.current, visibleEntities);
    }, [areas]);

    useEffect(() => {
        dataSource.current.show = showAreas;
        requestRender();
    }, [showAreas, requestRender]);

    useEffect(() => {
        if (enableTerrain) {
            heightReference = HeightReference.CLAMP_TO_GROUND;
        } else {
            heightReference = HeightReference.NONE;
        }
    }, [enableTerrain]);

    useEffect(() => {
        visibleEntities.current.clear();
        if (areasVisible) {
            areasVisible.forEach(id => visibleEntities.current.add(id));
        }
    }, [areasVisible]);


    return dataSource.current;
}
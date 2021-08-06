import { GeoJsonDataSource, Cartesian2, Cartesian3, Color, HeightReference, CallbackProperty, NearFarScalar, DistanceDisplayCondition, LabelStyle, VerticalOrigin, HorizontalOrigin } from "cesium";
import { useEffect, useRef } from "react";
import { useStateValue } from "../../utils/state";

let heightReference = HeightReference.NONE;
const dynamicHeightReference = new CallbackProperty(function () {
    return heightReference;
}, false);

async function setupCCSites(ccsites, dataSource, visibleEntities) {
    const features = [...ccsites.values()].map(ccsite => ({ type: "Feature", id: ccsite.id, name: ccsite.name, geometry: ccsite.Geometry, properties: { id: ccsite.id } }));
    const geoJson = { type: "FeatureCollection", features: features };
    await dataSource.load(geoJson);
    const p = dataSource.entities.values;
    for (var i = 0; i < p.length; i++) {
        const entity = p[i];
        const rawEntity = ccsites.get(entity.properties.id.getValue().toString());
        if (rawEntity) {
            entity.originalData = rawEntity;
        }
        if (entity.polygon) {
            entity.polygon.zIndex = 30;
        }
        if (entity.billboard) {
            entity.billboard = undefined;


            entity.point = {
                pixelSize: 4,
                color: Color.DARKBLUE,
                eyeOffset: new Cartesian3(0, 0, 1),
                distanceDisplayCondition: new DistanceDisplayCondition(0.0, 8500009.5),
                translucencyByDistance: new NearFarScalar(2300009.5, 1, 8500009.5, 0.01),
                heightReference: dynamicHeightReference,
                zIndex: 60
            };

            entity.label = {
                text: rawEntity["Operator"],
                font: "20px Arial Narrow",
                fillColor: Color.BLACK,
                style: LabelStyle.FILL,
                outlineColor: Color.WHITE,
                outlineWidth: 1.5,
                pixelOffset: new Cartesian2(25, 0),
                verticalOrigin: VerticalOrigin.CENTER,
                horizontalOrigin: HorizontalOrigin.LEFT,
                distanceDisplayCondition: new DistanceDisplayCondition(0.0, 300000),
                heightReference: dynamicHeightReference,
                scale: 0.65,
                zIndex: 60
            };
        }


    }
}

export function useCCSites({ requestRender }) {
    const [{ ccsites, showCCSites, CCSitesVisible },] = useStateValue();
    const dataSource = useRef(new GeoJsonDataSource("CCSite"));
    const visibleEntities = useRef(new Set());
    useEffect(() => {
        dataSource.current.entities.removeAll();
        setupCCSites(ccsites, dataSource.current, visibleEntities);
    }, [ccsites]);

    useEffect(() => {
        dataSource.current.show = showCCSites;
        requestRender();
    }, [showCCSites, requestRender]);

    useEffect(() => {
        visibleEntities.current.clear();
        if (CCSitesVisible) {
            CCSitesVisible.forEach(id => visibleEntities.current.add(id));
        }
    }, [CCSitesVisible]);


    return dataSource.current;
}
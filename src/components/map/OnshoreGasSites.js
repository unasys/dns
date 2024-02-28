import { HeightReference, GeoJsonDataSource, Cartesian2, Cartesian3, Color, DistanceDisplayCondition, HorizontalOrigin, LabelStyle, NearFarScalar, VerticalOrigin } from "cesium";
import { useEffect, useRef } from "react";
import { useStateValue } from "../../utils/state";


/* This comment is pointless but I did it to trigger an auto build*/

const colours = {
    "removed": Color.DIMGREY,
    "default": Color.DIMGREY
}

function getInstallationColour(installation) {
    let status = installation?.Status;
    if (status) {
        status = status.toLowerCase();
    }

    let colour = colours[status];
    if (!colour) {
        colour = colours["default"];
    }

    return colour;
}

async function setupOnshoreGasSites(onshoreGasSites, dataSource, visibleEntities) {
    const dynamicHeightReference = HeightReference.NONE;
    const features = [...onshoreGasSites.values()].map(onshoreGasSite => ({ type: "Feature", id: onshoreGasSite.id, name: onshoreGasSite.name, geometry: onshoreGasSite.Geometry, properties: { id: onshoreGasSite.id } }));
    const geoJson = { type: "FeatureCollection", features: features };
    await dataSource.load(geoJson);
    const p = dataSource.entities.values;
    for (let i = 0; i < p.length; i++) {
        const entity = p[i];
        if (entity.polygon) {
            entity.polygon.zIndex = 40;
        }
        const rawEntity = onshoreGasSites.get(entity.properties.id.getValue().toString());
        if (rawEntity) {
            entity.originalData = rawEntity;
        }
        if (entity.billboard) {
            entity.billboard = undefined;


            entity.point = {
                pixelSize: 4,
                color: getInstallationColour("", rawEntity),
                eyeOffset: new Cartesian3(0, 0, 1),
                distanceDisplayCondition: new DistanceDisplayCondition(0.0, 8500009.5),
                translucencyByDistance: new NearFarScalar(2300009.5, 1, 8500009.5, 0.01),
                heightReference: dynamicHeightReference,
                zIndex: 60
            };

            entity.label = {
                text: rawEntity.name,
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

export function useOnshoreGasSites({ requestRender }) {
    const [{ onshoreGasSites, showOnshoreGasSites, onshoreGasSitesVisible },] = useStateValue();
    const dataSource = useRef(new GeoJsonDataSource("OnshoreGasSite"));
    const visibleEntities = useRef(new Set());
    useEffect(() => {
        dataSource.current.entities.removeAll();
        setupOnshoreGasSites(onshoreGasSites, dataSource.current, visibleEntities);
    }, [onshoreGasSites]);

    useEffect(() => {
        dataSource.current.show = showOnshoreGasSites;
        requestRender();
    }, [showOnshoreGasSites, requestRender]);

    useEffect(() => {
        visibleEntities.current.clear();
        if (onshoreGasSitesVisible) {
            onshoreGasSitesVisible.forEach(id => visibleEntities.current.add(id));
        }
    }, [onshoreGasSitesVisible]);


    return dataSource.current;
}
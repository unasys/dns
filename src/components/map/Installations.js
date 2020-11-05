import { CallbackProperty, Cartesian2, Cartesian3, Color, DistanceDisplayCondition, GeoJsonDataSource, HeightReference, HorizontalOrigin, JulianDate, LabelStyle, NearFarScalar, TimeInterval, TimeIntervalCollection, VerticalOrigin } from "cesium";
import { useEffect, useRef } from "react";
import { useStateValue } from "../../utils/state";

const colours = {
    "removed": Color.DIMGREY,
    "default": Color.DIMGREY
}

let heightReference = HeightReference.NONE;
const dynamicHeightReference = new CallbackProperty(function () {
    return heightReference;
}, false);

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

async function setupInstallations(installations, dataSource) {
    const features = [...installations.values()].map(installation => ({ type: "Feature", id: installation.id, name: installation.name, geometry: installation.Geometry, properties: { id: installation.id } }));
    const geoJson = { type: "FeatureCollection", features: features };
    await dataSource.load(geoJson);
    const p = dataSource.entities.values;
    for (let i = 0; i < p.length; i++) {
        const entity = p[i];
        const rawEntity = installations.get(entity.properties.id.getValue().toString());
        if (rawEntity) {
            entity.originalData = rawEntity;

            if (entity.billboard) {
                entity.billboard = undefined;

                let start = rawEntity.StartDate;
                let end = rawEntity.PlannedCOP;

                if (start) {
                    start = JulianDate.fromDate(new Date(start));
                }
                else {
                    start = JulianDate.fromDate(new Date("1901"));
                }

                if (end) {
                    end = JulianDate.fromDate(new Date(end));
                }
                else {
                    end = JulianDate.fromDate(new Date("2500"));
                }

                if (start || end) {
                    const interval = new TimeInterval({
                        start: start,
                        stop: end,
                        isStartIncluded: start !== null,
                        isStopIncluded: end !== null
                    });
                    entity.availability = new TimeIntervalCollection([interval]);
                }

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

}

export function useInstallations({ requestRender }) {
    const [{ installations, showInstallations, installationsVisible, enableTerrain },] = useStateValue();
    const dataSource = useRef(new GeoJsonDataSource("Installation"));
    const visibleEntities = useRef(new Set());
    useEffect(() => {
        async function work() {
            dataSource.current.entities.removeAll();
            await setupInstallations(installations, dataSource.current, visibleEntities);
        }
        work();
    }, [installations, requestRender]);

    useEffect(() => {
        dataSource.current.show = showInstallations;
        requestRender();
    }, [showInstallations, requestRender]);

    useEffect(() => {
        visibleEntities.current.clear();
        if (installationsVisible) {
            installationsVisible.forEach(id => visibleEntities.current.add(id));
        }
    }, [installationsVisible]);

    useEffect(() => {
        if (enableTerrain) {
            heightReference = HeightReference.CLAMP_TO_GROUND;
        } else {
            heightReference = HeightReference.NONE;
        }
    }, [enableTerrain]);

    return dataSource.current;
}
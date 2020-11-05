import { CallbackProperty, Cartesian3, Color, DistanceDisplayCondition, GeoJsonDataSource, HeightReference, NearFarScalar } from "cesium";
import { useEffect, useRef } from "react";
import { useStateValue } from "../../utils/state";

const dynamicHeightReference = new CallbackProperty(function () {
    return HeightReference.NONE;
}, true)

async function setupOnshoreWindfarms(onshoreWindfarms, dataSource, visibleEntities) {
    const features = [...onshoreWindfarms.values()].map(onshoreWindfarm => ({ type: "Feature", id: onshoreWindfarm.id, name: onshoreWindfarm.name, geometry: onshoreWindfarm.Geometry, properties: { id: onshoreWindfarm.id } }));
    const geoJson = { type: "FeatureCollection", features: features };
    await dataSource.load(geoJson);
    const p = dataSource.entities.values;
    for (let i = 0; i < p.length; i++) {
        const entity = p[i];

        if (entity.billboard) {
            entity.billboard = undefined;
            entity.point = {
                pixelSize: 4,
                color: Color.CADETBLUE,
                eyeOffset: new Cartesian3(0, 0, 1),
                distanceDisplayCondition: new DistanceDisplayCondition(0.0, 8500009.5),
                translucencyByDistance: new NearFarScalar(2300009.5, 1, 8500009.5, 0.01),
                heightReference: dynamicHeightReference,
                zIndex: 60
            };
        }

        const rawEntity = onshoreWindfarms.get(entity.properties.id.getValue().toString());
        if (rawEntity) {
            entity.originalData = rawEntity;
        }
    }
}

export function useOnshoreWindfarms({ requestRender }) {
    const [{ onshoreWindfarms, showOnshoreWindfarms, onshoreWindfarmsVisible },] = useStateValue();
    const dataSource = useRef(new GeoJsonDataSource("OnshoreWindfarm"));
    const visibleEntities = useRef(new Set());
    useEffect(() => {
        dataSource.current.entities.removeAll();
        setupOnshoreWindfarms(onshoreWindfarms, dataSource.current, visibleEntities);
    }, [onshoreWindfarms]);

    useEffect(() => {
        dataSource.current.show = showOnshoreWindfarms;
        requestRender();
    }, [showOnshoreWindfarms, requestRender]);

    useEffect(() => {
        visibleEntities.current.clear();
        if (onshoreWindfarmsVisible) {
            onshoreWindfarmsVisible.forEach(id => visibleEntities.current.add(id));
        }
    }, [onshoreWindfarmsVisible]);


    return dataSource.current;
}
import { GeoJsonDataSource } from "cesium";
import { useEffect, useRef } from "react";
import { useStateValue } from "../../utils/state";

async function setupOnshoreGasSites(onshoreGasSites, dataSource, visibleEntities) {
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
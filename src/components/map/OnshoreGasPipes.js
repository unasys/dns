import { Color, GeoJsonDataSource } from "cesium";
import { useEffect, useRef } from "react";
import { useStateValue } from "../../utils/state";

async function setupOnshoreGasPipes(onshoreGasPipes, dataSource, visibleEntities) {
    const features = [...onshoreGasPipes.values()].map(onshoreGasPipe => ({ type: "Feature", id: onshoreGasPipe.id, name: onshoreGasPipe.name, geometry: onshoreGasPipe.Geometry, properties: { id: onshoreGasPipe.id } }));
    const geoJson = { type: "FeatureCollection", features: features };
    await dataSource.load(geoJson);
    const p = dataSource.entities.values;
    for (let i = 0; i < p.length; i++) {
        const entity = p[i];

        const rawEntity = onshoreGasPipes.get(entity.properties.id.getValue().toString());
        if (rawEntity) {
            entity.originalData = rawEntity;
        }

        if (entity.polyline) {
            entity.polyline.material = Color.BLACK;
            entity.polyline.width = 2;
            entity.polyline.zIndex = 50;
            entity.polyline.clampToGround = true;
        }

    }
}

export function useOnshoreGasPipes({ requestRender }) {
    const [{ onshoreGasPipes, showOnshoreGasPipes, onshoreGasPipesVisible },] = useStateValue();
    const dataSource = useRef(new GeoJsonDataSource("OnshoreGasPipe"));
    const visibleEntities = useRef(new Set());
    useEffect(() => {
        dataSource.current.entities.removeAll();
        setupOnshoreGasPipes(onshoreGasPipes, dataSource.current, visibleEntities);
    }, [onshoreGasPipes]);

    useEffect(() => {
        dataSource.current.show = showOnshoreGasPipes;
        requestRender();
    }, [showOnshoreGasPipes, requestRender]);

    useEffect(() => {
        visibleEntities.current.clear();
        if (onshoreGasPipesVisible) {
            onshoreGasPipesVisible.forEach(id => visibleEntities.current.add(id));
        }
    }, [onshoreGasPipesVisible]);


    return dataSource.current;
}
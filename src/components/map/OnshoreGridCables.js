import { Color, GeoJsonDataSource } from "cesium";
import { useEffect, useRef } from "react";
import { useStateValue } from "../../utils/state";

async function setupOnshoreGridCables(onshoreGridCables, dataSource, visibleEntities) {
    const features = [...onshoreGridCables.values()].map(onshoreGridCable => ({ type: "Feature", id: onshoreGridCable.id, name: onshoreGridCable.name, geometry: onshoreGridCable.Geometry, properties: { id: onshoreGridCable.id } }));
    const geoJson = { type: "FeatureCollection", features: features };
    await dataSource.load(geoJson);
    const p = dataSource.entities.values;
    for (let i = 0; i < p.length; i++) {
        const entity = p[i];

        const rawEntity = onshoreGridCables.get(entity.properties.id.getValue().toString());
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

export function useOnshoreGridCables({ requestRender }) {
    const [{ onshoreGridCables, showOnshoreGridCables, onshoreGridCablesVisible },] = useStateValue();
    const dataSource = useRef(new GeoJsonDataSource("OnshoreGridCable"));
    const visibleEntities = useRef(new Set());
    useEffect(() => {
        dataSource.current.entities.removeAll();
        setupOnshoreGridCables(onshoreGridCables, dataSource.current, visibleEntities);
    }, [onshoreGridCables]);

    useEffect(() => {
        dataSource.current.show = showOnshoreGridCables;
        requestRender();
    }, [showOnshoreGridCables, requestRender]);

    useEffect(() => {
        visibleEntities.current.clear();
        if (onshoreGridCablesVisible) {
            onshoreGridCablesVisible.forEach(id => visibleEntities.current.add(id));
        }
    }, [onshoreGridCablesVisible]);


    return dataSource.current;
}
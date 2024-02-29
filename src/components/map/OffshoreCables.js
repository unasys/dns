import { Color, GeoJsonDataSource } from "cesium";
import { useEffect, useRef } from "react";
import { useStateValue } from "../../utils/state";


async function setupOffshoreCables(cables, dataSource, visibleEntities) {
    const features = [...cables.values()].map(cable => ({ type: "Feature", id: cable.name, name: cable.name, geometry: cable.Geometry, properties: { name: cable.name, id: cable.name } }));
    const geoJson = { type: "FeatureCollection", features: features };
    await dataSource.load(geoJson);
    const p = dataSource.entities.values;
    for (let i = 0; i < p.length; i++) {
        const entity = p[i];
        const rawEntity = cables.get(entity.properties.name?.getValue()?.toString());
        if (rawEntity) {
            entity.originalData = rawEntity;
            
            let colour = Color.GREY;

            if (entity.polyline) {

                entity.polyline.material = colour;
                entity.polyline.width = 2;
                entity.polyline.zIndex = 50;
                entity.polyline.clampToGround = true;
            }
        }

    }
}

export function useOffshoreCables({ requestRender }) {
    const [{ offshoreCables, showOffshoreCables, offshoreCablesVisible },] = useStateValue();
    const dataSource = useRef(new GeoJsonDataSource("OffshoreCable"));
    const visibleEntities = useRef(new Set());
    useEffect(() => {
        dataSource.current.entities.removeAll();
        setupOffshoreCables(offshoreCables, dataSource.current, visibleEntities);
    }, [offshoreCables]);

    useEffect(() => {
        dataSource.current.show = showOffshoreCables;
        requestRender();
    }, [showOffshoreCables, requestRender]);

    useEffect(() => {
        visibleEntities.current.clear();
        if (offshoreCablesVisible) {
            offshoreCablesVisible.forEach(id => visibleEntities.current.add(id));
        }
    }, [offshoreCablesVisible]);

    return dataSource.current;
}
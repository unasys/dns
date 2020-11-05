import { Color, GeoJsonDataSource } from "cesium";
import { useEffect, useRef } from "react";
import { useStateValue } from "../../utils/state";

async function setupOnshorePowerlines(onshorePowerlines, dataSource, visibleEntities) {
    const features = [...onshorePowerlines.values()].map(onshorePowerline => ({ type: "Feature", id: onshorePowerline.id, name: onshorePowerline.name, geometry: onshorePowerline.Geometry, properties: { id: onshorePowerline.id } }));
    const geoJson = { type: "FeatureCollection", features: features };
    await dataSource.load(geoJson);
    const p = dataSource.entities.values;
    for (let i = 0; i < p.length; i++) {
        const entity = p[i];

        const rawEntity = onshorePowerlines.get(entity.properties.id.getValue().toString());
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

export function useOnshorePowerlines({ requestRender }) {
    const [{ onshorePowerlines, showOnshorePowerlines, onshorePowerlinesVisible },] = useStateValue();
    const dataSource = useRef(new GeoJsonDataSource("OnshorePowerline"));
    const visibleEntities = useRef(new Set());
    useEffect(() => {
        dataSource.current.entities.removeAll();
        setupOnshorePowerlines(onshorePowerlines, dataSource.current, visibleEntities);
    }, [onshorePowerlines]);

    useEffect(() => {
        dataSource.current.show = showOnshorePowerlines;
        requestRender();
    }, [showOnshorePowerlines, requestRender]);

    useEffect(() => {
        visibleEntities.current.clear();
        if (onshorePowerlinesVisible) {
            onshorePowerlinesVisible.forEach(id => visibleEntities.current.add(id));
        }
    }, [onshorePowerlinesVisible]);


    return dataSource.current;
}
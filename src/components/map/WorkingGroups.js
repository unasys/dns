import { GeoJsonDataSource } from "cesium";
import { useEffect, useRef } from "react";
import { useStateValue } from "../../utils/state";

async function setupWorkingGroups(workingGroups, dataSource, visibleEntities) {
    const features = [...workingGroups.values()].map(workingGroup => ({ type: "Feature", id: workingGroup.id, name: workingGroup.name, geometry: workingGroup.Geometry, properties: { id: workingGroup.id } }));
    const geoJson = { type: "FeatureCollection", features: features };
    await dataSource.load(geoJson);
    const p = dataSource.entities.values;
    for (let i = 0; i < p.length; i++) {
        const entity = p[i];
        if (entity.polygon) {
            entity.polygon.zIndex = 40;
        }
        const rawEntity = workingGroups.get(entity.properties.id.getValue().toString());
        if (rawEntity) {
            entity.originalData = rawEntity;
        }

    }
}

export function useWorkingGroups({ requestRender }) {
    const [{ workingGroups, showWorkingGroups, workingGroupsVisible },] = useStateValue();
    const dataSource = useRef(new GeoJsonDataSource("WorkingGroup"));
    const visibleEntities = useRef(new Set());
    useEffect(() => {
        dataSource.current.entities.removeAll();
        setupWorkingGroups(workingGroups, dataSource.current, visibleEntities);
    }, [workingGroups]);

    useEffect(() => {
        dataSource.current.show = showWorkingGroups;
        requestRender();
    }, [showWorkingGroups, requestRender]);

    useEffect(() => {
        visibleEntities.current.clear();
        if (workingGroupsVisible) {
            workingGroupsVisible.forEach(id => visibleEntities.current.add(id));
        }
    }, [workingGroupsVisible]);


    return dataSource.current;
}
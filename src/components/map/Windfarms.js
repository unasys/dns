import { Cartesian3, Color, DistanceDisplayCondition, GeoJsonDataSource } from "cesium";
import { useEffect, useRef } from "react";
import { useStateValue } from "../../utils/state";

async function setupWindfarms(windfarms, dataSource, visibleEntities) {
    const features = [...windfarms.values()].map(windfarm => ({ type: "Feature", id: windfarm.id, name: windfarm.name, geometry: windfarm.Geometry, properties: { id: windfarm.id } }));
    const geoJson = { type: "FeatureCollection", features: features };
    await dataSource.load(geoJson);
    const p = dataSource.entities.values;
    for (let i = 0; i < p.length; i++) {
        const entity = p[i];

        if (entity.polygon) {
            entity.polygon.zIndex = 40;
            entity.polygon.outlineColor = Color.fromCssColorString("#BADBCA");
            entity.polygon.material = Color.fromCssColorString("#BADBCA").withAlpha(0.75);
        }

        const rawEntity = windfarms.get(entity.properties.id.getValue().toString());
        if (rawEntity) {
            entity.originalData = rawEntity;
        }

        switch (entity?.originalData?.Type) {
            case "wind turbine": {
                entity.billboard = {
                    image: "/images/windturbine.svg",
                    eyeOffset: new Cartesian3(0, 0, 1),
                    distanceDisplayCondition: new DistanceDisplayCondition(0.0, 35000),
                    scale: 0.35,
                    zIndex: 60
                };
                break;
            }
            case "Turbine Cable": {
                if (entity.polyline) {
                    entity.polyline.material = Color.fromCssColorString("#F47C7C")
                }
                break;
            }
            case "Export cable":
            case "Export Cable": {
                if (entity.polyline) {
                    entity.polyline.material = Color.fromCssColorString("#A4A9A7");
                }
                break;
            }
            case "Substation": {
                entity.billboard = {
                    image: "/images/offshore-substation.svg",
                    eyeOffset: new Cartesian3(0, 0, 1),
                    distanceDisplayCondition: new DistanceDisplayCondition(0.0, 35000),
                    scale: 0.35,
                    zIndex: 60
                };
                break;
            }
            default: break;
        }
    }
}

export function useWindfarms({ requestRender }) {
    const [{ windfarms, showWindfarms, windfarmsVisible },] = useStateValue();
    const dataSource = useRef(new GeoJsonDataSource("Windfarm"));
    const visibleEntities = useRef(new Set());
    useEffect(() => {
        setupWindfarms(windfarms, dataSource.current, visibleEntities);
    }, [windfarms]);

    useEffect(() => {
        dataSource.current.show = showWindfarms;
        requestRender()
    }, [showWindfarms, requestRender]);

    useEffect(() => {
        visibleEntities.current.clear();
        if (windfarmsVisible) {
            windfarmsVisible.forEach(id => visibleEntities.current.add(id));
        }
    }, [windfarmsVisible]);


    return dataSource.current;
}
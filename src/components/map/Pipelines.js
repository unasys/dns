import { Color, DistanceDisplayCondition, GeoJsonDataSource, JulianDate, TimeInterval, TimeIntervalCollection } from "cesium";
import { useEffect, useRef } from "react";
import { useStateValue } from "../../utils/state";

// const colours = {
//     "chemical": Color.fromBytes(255, 165, 0),
//     "condensate": Color.fromBytes(132, 0, 168),
//     "fibre": Color.fromBytes(139, 69, 19),
//     "gas": Color.fromBytes(255, 51, 0),
//     "hydraulic": Color.fromBytes(255, 255, 0),
//     "methanol": Color.fromBytes(223, 155, 255),
//     "mixed hydrocarbons": Color.fromBytes(155, 0, 76),
//     "oil": Color.fromBytes(56, 168, 0),
//     "other fluid": Color.fromBytes(161, 0, 123),
//     "water": Color.fromBytes(0, 92, 230),
//     "disused": Color.fromBytes(128, 128, 128),
//     "default": Color.WHITE
// }

const colours = {
    "default": Color.fromCssColorString("#DCDCDC")
}

function getPipelineColour(pipeline) {
    let pipelineFluid = pipeline.fluid_conveyed;
    if (pipelineFluid) {
        pipelineFluid = pipelineFluid.toLowerCase();
    }

    let colour = colours[pipelineFluid];

    if (!colour) {
        colour = colours["default"];
    }

    if (pipeline.status !== "ACTIVE") {
        colour = colour.withAlpha(0.5);
    }

    return colour;
}

const scaleBetween = (unscaledNum, minAllowed, maxAllowed, min, max) => {
    return (maxAllowed - minAllowed) * (unscaledNum - min) / (max - min) + minAllowed;
}

async function setupPipelines(pipelines, dataSource, visibleEntities) {
    const minDiameter = 0;
    const maxDiameter = 1058;
    const features = [...pipelines.values()].map(pipeline => ({ type: "Feature", id: pipeline.id, name: pipeline.name, geometry: pipeline.Geometry, properties: { id: pipeline.id } }));
    const geoJson = { type: "FeatureCollection", features: features };
    await dataSource.load(geoJson);
    const p = dataSource.entities.values;
    for (let i = 0; i < p.length; i++) {
        const entity = p[i];
        const rawEntity = pipelines.get(entity.properties.id?.getValue()?.toString());
        if (rawEntity) {
            entity.originalData = rawEntity;


            let start = rawEntity["start_date"];
            if (start) {
                start = JulianDate.fromDate(new Date(start));
            }
            else {
                start = JulianDate.fromDate(new Date("1901"));
            }
            let end = rawEntity["end_date"];
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

            const pipeDiameter = parseInt(rawEntity.diameter_value) || 0

            //const scaledWidth = scaleBetween(pipeDiameter, 0.5, 1, minDiameter, maxDiameter);
            const scaledDistance = scaleBetween(pipeDiameter, 150000, 50000000, minDiameter, maxDiameter);

            if (entity.polyline) {
                entity.polyline.material = getPipelineColour(rawEntity);
                entity.polyline.width = 2;
                entity.polyline.distanceDisplayCondition = new DistanceDisplayCondition(0, scaledDistance);
                entity.polyline.zIndex = 50;
                entity.polyline.clampToGround = true;
            }
        }

    }
}

export function usePipelines({ requestRender }) {
    const [{ pipelines, showPipelines, pipelinesVisible },] = useStateValue();
    const dataSource = useRef(new GeoJsonDataSource("Pipeline"));
    const visibleEntities = useRef(new Set());
    useEffect(() => {
        dataSource.current.entities.removeAll();
        setupPipelines(pipelines, dataSource.current, visibleEntities);
    }, [pipelines]);

    useEffect(() => {
        dataSource.current.show = showPipelines;
        requestRender();
    }, [showPipelines, requestRender]);

    useEffect(() => {
        visibleEntities.current.clear();
        if (pipelinesVisible) {
            pipelinesVisible.forEach(id => visibleEntities.current.add(id));
        }
    }, [pipelinesVisible]);


    return dataSource.current;
}
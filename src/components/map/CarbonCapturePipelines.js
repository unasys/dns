import { Color, DistanceDisplayCondition, GeoJsonDataSource, JulianDate, TimeInterval, TimeIntervalCollection } from "cesium";
import { useEffect, useRef } from "react";
import { useStateValue } from "../../utils/state";

const colours = {
    "chemical": Color.fromBytes(255, 165, 0),
    "condensate": Color.fromBytes(132, 0, 168),
    "fibre": Color.fromBytes(139, 69, 19),
    "gas": Color.fromBytes(255, 51, 0),
    "hydraulic": Color.fromBytes(255, 255, 0),
    "methanol": Color.fromBytes(223, 155, 255),
    "mixed hydrocarbons": Color.fromBytes(155, 0, 76),
    "oil": Color.fromBytes(56, 168, 0),
    "other fluid": Color.fromBytes(161, 0, 123),
    "water": Color.fromBytes(0, 92, 230),
    "disused": Color.fromBytes(128, 128, 128),
    "default": Color.WHITE
}

function getCCPipelineColour(ccpipeline) {
    let ccpipelineFluid = ccpipeline.fluid_conveyed;
    if (ccpipelineFluid) {
        ccpipelineFluid = ccpipelineFluid.toLowerCase();
    }

    let colour = colours[ccpipelineFluid];

    if (!colour) {
        colour = colours["default"];
    }

    if (ccpipeline.status !== "ACTIVE") {
        colour = colour.withAlpha(0.5);
    }

    return colour;
}

const scaleBetween = (unscaledNum, minAllowed, maxAllowed, min, max) => {
    return (maxAllowed - minAllowed) * (unscaledNum - min) / (max - min) + minAllowed;
}

async function setupCCPipelines(ccpipelines, dataSource, visibleEntities) {
    const minDiameter = 0;
    const maxDiameter = 1058;
    const features = [...ccpipelines.values()].map(ccpipeline => ({ type: "Feature", id: ccpipeline.id, name: ccpipeline.name, geometry: ccpipeline.Geometry, properties: { id: ccpipeline.id } }));
    const geoJson = { type: "FeatureCollection", features: features };
    await dataSource.load(geoJson);
    const p = dataSource.entities.values;
    for (let i = 0; i < p.length; i++) {
        const entity = p[i];
        const rawEntity = ccpipelines.get(entity.properties.id?.getValue()?.toString());
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
                entity.polyline.material = getCCPipelineColour(rawEntity);
                entity.polyline.width = 2;
                entity.polyline.distanceDisplayCondition = new DistanceDisplayCondition(0, scaledDistance);
                entity.polyline.zIndex = 50;
                entity.polyline.clampToGround = true;
            }
        }

    }
}

export function useCCPipelines({ requestRender }) {
    const [{ ccpipelines, showCCPipelines, ccpipelinesVisible },] = useStateValue();
    const dataSource = useRef(new GeoJsonDataSource("CCPipeline"));
    const visibleEntities = useRef(new Set());
    useEffect(() => {
        dataSource.current.entities.removeAll();
        setupCCPipelines(ccpipelines, dataSource.current, visibleEntities);
    }, [ccpipelines]);

    useEffect(() => {
        dataSource.current.show = showCCPipelines;
        requestRender();
    }, [showCCPipelines, requestRender]);

    useEffect(() => {
        visibleEntities.current.clear();
        if (ccpipelinesVisible) {
            ccpipelinesVisible.forEach(id => visibleEntities.current.add(id));
        }
    }, [ccpipelinesVisible]);


    return dataSource.current;
}
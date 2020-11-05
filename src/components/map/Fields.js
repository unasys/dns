import { Color, GeoJsonDataSource, JulianDate, TimeInterval, TimeIntervalCollection } from "cesium";
import { useEffect, useRef } from "react";
import { useStateValue } from "../../utils/state";

const colours = {
    "chemical": Color.fromBytes(255, 165, 0),
    "cond": Color.fromBytes(154, 159, 167),
    "fibre": Color.fromBytes(139, 69, 19),
    "gas": Color.fromBytes(133, 30, 7),
    "hydraulic": Color.fromBytes(255, 255, 0),
    "methanol": Color.fromBytes(223, 155, 255),
    "mixed hydrocarbons": Color.fromBytes(155, 0, 76),
    "oil": Color.fromBytes(53, 86, 36),
    "other fluid": Color.fromBytes(161, 0, 123),
    "water": Color.fromBytes(0, 92, 230),
    "disused": Color.fromBytes(128, 128, 128),
    "default": Color.WHITE
}

const getFieldColour = (field) => {
    let hcType = field["Hydrocarbon Type"];
    if (hcType) {
        hcType = hcType.toLowerCase();
    }
    let colour = colours[hcType];
    if (!colour) {
        colour = colours["default"];
    }
    colour = colour.withAlpha(0.7);

    return colour;
}

async function setupFields(fields, dataSource, visibleEntities) {
    const features = [...fields.values()].map(field => ({ type: "Feature", id: field.id, name: field.name, geometry: field.Geometry, properties: { id: field.id } }));
    const geoJson = { type: "FeatureCollection", features: features };
    await dataSource.load(geoJson);
    const p = dataSource.entities.values;
    for (var i = 0; i < p.length; i++) {
        const entity = p[i];
        if (entity.polygon) {
            entity.polygon.zIndex = 30;
        }
        const rawEntity = fields.get(entity.properties.id.getValue().toString());
        if (rawEntity) {
            entity.originalData = rawEntity;
            if (entity.polygon) {
                let start = rawEntity["Discovery Date"];
                let end;

                if (start) {
                    start = JulianDate.fromDate(new Date(start));
                }
                else {
                    start = JulianDate.fromDate(new Date("1901"));
                }

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

                const material = getFieldColour(rawEntity);
                entity.polygon.material = material;
                entity.polygon.outline = false;
            }
        }
    }
}

export function useFields({requestRender}) {
    const [{ fields, showFields, fieldsVisible },] = useStateValue();
    const dataSource = useRef(new GeoJsonDataSource("Field"));
    const visibleEntities = useRef(new Set());
    useEffect(() => {
        dataSource.current.entities.removeAll();
        setupFields(fields, dataSource.current, visibleEntities);
    }, [fields]);

    useEffect(() => {
        dataSource.current.show = showFields;
        requestRender();
    }, [showFields, requestRender]);

    useEffect(() => {
        visibleEntities.current.clear();
        if (fieldsVisible) {
            fieldsVisible.forEach(id => visibleEntities.current.add(id));
        }
    }, [fieldsVisible]);


    return dataSource.current;
}
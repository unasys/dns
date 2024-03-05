import { Cartesian2, Cartesian3, Color, DistanceDisplayCondition, GeoJsonDataSource, HeightReference, HorizontalOrigin, LabelStyle, NearFarScalar, VerticalOrigin } from "cesium";
import { useEffect, useRef } from "react";
import { useStateValue } from "../../utils/state";

async function setupWorkingGroups(workingGroups, dataSource, visibleEntities) {
    const features = [...workingGroups.values()].map(workingGroup => ({ type: "Feature", id: workingGroup.id, name: workingGroup.name, geometry: workingGroup.Geometry, properties: { id: workingGroup.id } }));
    const geoJson = { type: "FeatureCollection", features: features };
    await dataSource.load(geoJson);
    const p = dataSource.entities.values;
    for (let i = 0; i < p.length; i++) 
    {
        const entity = p[i];

        const rawEntity = workingGroups.get(entity.properties.id.getValue().toString());
        if (rawEntity) {
            entity.originalData = rawEntity;
        }


        let entityColour;
        if(rawEntity["Colour on DNS"] == null) {
            entityColour = Color.GREY;
        }
        else {
            entityColour = Color.fromCssColorString(rawEntity["Colour on DNS"]);
        }
        
        
        if (entity.polygon) {
            entity.polygon.zIndex = 40;
            entity.polygon.material = entityColour.withAlpha(0.4);
            entity.polygon.outlineColor = entityColour;
        }

        else if(entity.billboard)
        {
            entity.billboard = undefined;

            entity.point = {
                pixelSize: 4,
                color: entityColour,
                eyeOffset: new Cartesian3(0, 0, 1),
                //distanceDisplayCondition: new DistanceDisplayCondition(0.0, 8500009.5),
                translucencyByDistance: new NearFarScalar(2300009.5, 1, 8500009.5, 0.01),
                heightReference: HeightReference.NONE,
                zIndex: 60
            };

            // entity.label = {
            //     text: rawEntity.name,
            //     font: "20px Arial Narrow",
            //     fillColor: Color.BLACK,
            //     style: LabelStyle.FILL,
            //     outlineColor: Color.WHITE,
            //     outlineWidth: 1.5,
            //     pixelOffset: new Cartesian2(25, 0),
            //     verticalOrigin: VerticalOrigin.CENTER,
            //     horizontalOrigin: HorizontalOrigin.LEFT,
            //     distanceDisplayCondition: new DistanceDisplayCondition(0.0, 300000),
            //     heightReference: HeightReference.NONE,
            //     scale: 0.65,
            //     zIndex: 60
            // };
        }

        else if (entity.polyline) {
            entity.polyline.material = entityColour;
            entity.polyline.width = 2;
            entity.polyline.zIndex = 50;
            entity.polyline.clampToGround = true;
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
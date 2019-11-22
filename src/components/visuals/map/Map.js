import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

import './Map.scss';
import { useStateValue } from '../../../utils/state';
import HoverCard from './HoverCard';

const bathymetryBaseUrl = process.env.NODE_ENV === 'development' ? 'https://tiles.emodnet-bathymetry.eu/v9/terrain' : 'https://emodnet-terrain.azureedge.net/v9/terrain';
const assetsBaseUrl = process.env.NODE_ENV === 'development' ? 'https://digitalnorthsea.blob.core.windows.net' : 'https://assets.digitalnorthsea.com';
const ukBlocks = assetsBaseUrl + "/data/uk_blocks.json";

const iconModels = {
    "FPSO": assetsBaseUrl + "/models/platform-types/FPSO/lp_fpsoplat.gltf",
    "FPU": assetsBaseUrl + "/models/platform-types/FPU/fpu_lowpoly.gltf",
    "FPV": assetsBaseUrl + "/models/platform-types/FPV/lp_fpsoplat.gltf",
    "GravBase": assetsBaseUrl + "/models/platform-types/GravBase/lp_gravbase.gltf",
    "Jacket": assetsBaseUrl + "/models/platform-types/Jacket/lp_jacket.gltf",
    "Platform": assetsBaseUrl + "/models/platform-types/Jacket/lp_jacket.gltf",
    "FSO": assetsBaseUrl + "/models/platform-types/FPU/fpu_lowpoly.gltf"
};

const pipelineColours = {
    "chemical": window.Cesium.Color.fromBytes(255, 165, 0),
    "condensate": window.Cesium.Color.fromBytes(132, 0, 168),
    "fibre": window.Cesium.Color.fromBytes(139, 69, 19),
    "gas": window.Cesium.Color.fromBytes(255, 51, 0),
    "hydraulic": window.Cesium.Color.fromBytes(255, 255, 0),
    "methanol": window.Cesium.Color.fromBytes(223, 155, 255),
    "mixed hydrocarbons": window.Cesium.Color.fromBytes(155, 0, 76),
    "oil": window.Cesium.Color.fromBytes(56, 168, 0),
    "other fluid": window.Cesium.Color.fromBytes(161, 0, 123),
    "water": window.Cesium.Color.fromBytes(0, 92, 230),
    "disused": window.Cesium.Color.fromBytes(128, 128, 128),
    "default": window.Cesium.Color.WHITE
}

const fieldColours = {
    "chemical": window.Cesium.Color.fromBytes(255, 165, 0),
    "cond": window.Cesium.Color.fromBytes(154, 159, 167),
    "fibre": window.Cesium.Color.fromBytes(139, 69, 19),
    "gas": window.Cesium.Color.fromBytes(133, 30, 7),
    "hydraulic": window.Cesium.Color.fromBytes(255, 255, 0),
    "methanol": window.Cesium.Color.fromBytes(223, 155, 255),
    "mixed hydrocarbons": window.Cesium.Color.fromBytes(155, 0, 76),
    "oil": window.Cesium.Color.fromBytes(53, 86, 36),
    "other fluid": window.Cesium.Color.fromBytes(161, 0, 123),
    "water": window.Cesium.Color.fromBytes(0, 92, 230),
    "disused": window.Cesium.Color.fromBytes(128, 128, 128),
    "default": window.Cesium.Color.WHITE
}

const setupCesium = (cesiumRef) => {
    const terrainProvider = new window.Cesium.CesiumTerrainProvider({
        url: bathymetryBaseUrl,
        credit: "EMODnet Bathymetry Consortium (2018): EMODnet Digital Bathymetry (DTM)"
    });

    const mapbox = new window.Cesium.MapboxImageryProvider({
        mapId: 'mapbox.satellite',
        accessToken: 'pk.eyJ1IjoidW5hc3lzIiwiYSI6ImNqenR6MnBmMTA5dG4zbm80anEwdXVkaWUifQ.fzndysGAsyLbY8UyAMPMLQ'
    });

    // var maptiler = new window.Cesium.UrlTemplateImageryProvider({
    //     url: 'https://api.maptiler.com/maps/5a1e1d94-c972-4199-a26d-2f55f9abeb14/{z}/{x}/{y}.png?key=fU8GO3UjrAHXu6oeGQiM',
    //     credit: '<a href="https://www.maptiler.com/copyright/" target="_blank">© MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>'
    // });

    const viewer =
        new window.Cesium.Viewer(cesiumRef.current, {
            baseLayerPicker: false,
            animation: false,
            fullscreenButton: false,
            shadows: false,
            geocoder: false,
            infoBox: false,
            homeButton: false,
            sceneModePicker: false,
            selectionIndicator: false,
            timeline: false,
            navigationHelpButton: false,
            terrainProvider: terrainProvider,
            terrainExaggeration: 5,
            requestRenderMode: true,
            imageryProvider: mapbox
        });

    viewer.scene.globe.enableLighting = false;
    viewer.scene.globe.depthTestAgainstTerrain = false;
    return viewer;
}

const flyHome = (viewer) => {
    var west = -10.0;
    var south = 35.0;
    var east = 10.0;
    var north = 46.0;
    var rectangle = window.Cesium.Rectangle.fromDegrees(west, south, east, north);
    // fly to the north sea
    viewer.camera.flyTo({
        destination: rectangle,
        duration: 3,
        orientation: {
            heading: 0.0,
            pitch: window.Cesium.Math.toRadians(-50),
            roll: 0.0
        }
    });
}

const scaleBetween = (unscaledNum, minAllowed, maxAllowed, min, max) => {
    return (maxAllowed - minAllowed) * (unscaledNum - min) / (max - min) + minAllowed;
}

const mapInstallation = (installation) => {
    let start = installation.StartDate;
    let end = installation.PlannedCOP;

    if (start) {
        start = window.Cesium.JulianDate.fromDate(new Date(start));
    }
    else {
        start = window.Cesium.JulianDate.fromDate(new Date("1901"));
    }

    if (end) {
        end = window.Cesium.JulianDate.fromDate(new Date(end));
    }
    else {
        end = window.Cesium.JulianDate.fromDate(new Date("2500"));
    }

    const position = window.Cesium.Cartesian3.fromDegrees(installation.Longitude, installation.Latitude);
    let availability = null;
    if (start || end) {
        const interval = new window.Cesium.TimeInterval({
            start: start,
            stop: end,
            isStartIncluded: start !== null,
            isStopIncluded: end !== null
        });
        availability = new window.Cesium.TimeIntervalCollection([interval]);
    }

    const point = {
        pixelSize: 6,
        color: installation.Status === "Removed" ? window.Cesium.Color.fromCssColorString("#595436") : window.Cesium.Color.GOLD,
        outlineColor: window.Cesium.Color.BLACK,
        outlineWidth: 1,
        eyeOffset: new window.Cesium.Cartesian3(0, 0, 1),
        distanceDisplayCondition: new window.Cesium.DistanceDisplayCondition(0.0, 8500009.5),
        translucencyByDistance: new window.Cesium.NearFarScalar(2300009.5, 1, 8500009.5, 0.01),
        heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND
    };

    const model = {
        uri: iconModels[installation.Type],
        distanceDisplayCondition: new window.Cesium.DistanceDisplayCondition(0.0, 100000),
        scale: 0.18,
        heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND,
        shadows: window.Cesium.ShadowMode.DISABLED
    };

    const label = {
        text: installation["Name"],
        fillColor: window.Cesium.Color.WHITE,
        style: window.Cesium.LabelStyle.FILL,
        outlineColor: window.Cesium.Color.BLACK,
        outlineWidth: 1.5,
        pixelOffset: new window.Cesium.Cartesian2(25, 0),
        verticalOrigin: window.Cesium.VerticalOrigin.CENTER,
        horizontalOrigin: window.Cesium.HorizontalOrigin.LEFT,
        distanceDisplayCondition: new window.Cesium.DistanceDisplayCondition(0.0, 700000),
        heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND,
        scale: 0.7
    };

    return {
        id: installation["Name"],
        name: installation["Name"],
        position: position,
        availability: availability,
        point: point,
        model: model,
        label: label,
        originalData: installation
    }
}

const setupInstallations = (installations) => {
    const dataSource = new window.Cesium.CustomDataSource("Installation");
    installations.forEach(i => dataSource.entities.add(mapInstallation(i)));
    return dataSource;
}

const mapDecomyard = (decomyard) => {
    const position = window.Cesium.Cartesian3.fromDegrees(decomyard.Long, decomyard.Lat);
    const point = {
        pixelSize: 6,
        color: window.Cesium.Color.AQUA,
        eyeOffset: new window.Cesium.Cartesian3(0, 0, 1),
        distanceDisplayCondition: new window.Cesium.DistanceDisplayCondition(0.0, 8500009.5),
        translucencyByDistance: new window.Cesium.NearFarScalar(2300009.5, 1, 8500009.5, 0.01),
        heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND,
        outlineColor: window.Cesium.Color.BLACK,
        outlineWidth: 1,
    };
    const label = {
        text: decomyard["Name"],
        fillColor: window.Cesium.Color.WHITE,
        style: window.Cesium.LabelStyle.FILL_AND_OUTLINE,
        outlineColor: window.Cesium.Color.BLACK,
        outlineWidth: 1.5,
        pixelOffset: new window.Cesium.Cartesian2(25, 0),
        verticalOrigin: window.Cesium.VerticalOrigin.Bottom,
        horizontalOrigin: window.Cesium.HorizontalOrigin.LEFT,
        distanceDisplayCondition: new window.Cesium.DistanceDisplayCondition(0.0, 180000),
        heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND
    };
    return {
        id: decomyard["Name"],
        name: decomyard["Name"],
        position: position,
        point: point,
        label: label,
        originalData: decomyard
    }
}

const setupDecomyards = (decomyards) => {
    const dataSource = new window.Cesium.CustomDataSource("DecomYard");
    decomyards.forEach(i => dataSource.entities.add(mapDecomyard(i)));
    return dataSource;
}

const getPipelineColour = (pipeline) => {
    let pipelineFluid = pipeline["Fluid Conveyed"];
    if (pipelineFluid) {
        pipelineFluid = pipelineFluid.toLowerCase();
    }

    let colour = pipelineColours[pipelineFluid];
    if (!colour) {
        colour = pipelineColours["default"];
    }

    if (pipeline["Status"] !== "ACTIVE") {
        colour = colour.withAlpha(0.5);
    }

    colour = colour.darken(0.5, new window.Cesium.Color());

    return colour;
}
const pipelineScale = new window.Cesium.NearFarScalar(1.5e2, 1.5, 8.0e6, 0.0);
const mapPipeline = (pipeline) => {
    const minDiameter = 0;
    const maxDiameter = 1058;

    const coordinates = pipeline.Coordinates;
    if (Array.isArray(coordinates) && coordinates.length > 0) {
        if (Array.isArray(coordinates[0])) {

            let c = coordinates;
            if (coordinates[0].length > 0 && Array.isArray(coordinates[0][0])) {
                c = coordinates.flat();
            }
            const flatCoordinates = c.flat();

            const material = getPipelineColour(pipeline);

            let pipeDiameter = parseInt(pipeline.Diameter) || 0

            if (pipeline["Diameter Units"] === "inch") {
                pipeDiameter = pipeDiameter * 25.4;
            }
            const scaledWidth = scaleBetween(pipeDiameter, 2, 4, minDiameter, maxDiameter);
            const scaledDistance = scaleBetween(pipeDiameter, 150000, 50000000, minDiameter, maxDiameter);
            const scaledTextDistance = scaleBetween(pipeDiameter, 20000, 100000, minDiameter, maxDiameter);

            const a = Math.floor((flatCoordinates.length - 1) / 2);
            let y = flatCoordinates[a];
            let x = flatCoordinates[a + 1];

            // swapping them here due to a problem with the data. seemed to be mixed up in some cases.
            if (y < x) {
                var tempY = y;
                y = x;
                x = tempY;
            }
            var position = window.Cesium.Cartesian3.fromDegrees(x, y);

            const label =
            {
                text: pipeline["Pipeline Name"],
                fillColor: window.Cesium.Color.WHITE,
                style: window.Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineColor: material.color,
                outlineWidth: 1.5,
                pixelOffset: new window.Cesium.Cartesian2(25, 0),
                verticalOrigin: window.Cesium.VerticalOrigin.Bottom,
                horizontalOrigin: window.Cesium.HorizontalOrigin.LEFT,
                distanceDisplayCondition: new window.Cesium.DistanceDisplayCondition(0.0, scaledTextDistance),
                heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND,
                scaleByDistance: pipelineScale,
                font: '14px sans-serif'
            };

            let start = pipeline["Start Date"];
            if (start) {
                start = window.Cesium.JulianDate.fromDate(new Date(start));
            }
            else {
                start = window.Cesium.JulianDate.fromDate(new Date("1901"));
            }
            let end = pipeline["End Date"];
            if (end) {
                end = window.Cesium.JulianDate.fromDate(new Date(end));
            }
            else {
                end = window.Cesium.JulianDate.fromDate(new Date("2500"));
            }

            let availability = null;
            if (start || end) {
                const interval = new window.Cesium.TimeInterval({
                    start: start,
                    stop: end,
                    isStartIncluded: start !== null,
                    isStopIncluded: end !== null
                });
                availability = new window.Cesium.TimeIntervalCollection([interval]);
            }

            return {
                id: pipeline["Pipeline Id"],
                name: pipeline["Pipeline Name"],
                position: position,
                availability: availability,
                polyline: {
                    positions: window.Cesium.Cartesian3.fromDegreesArray(flatCoordinates),
                    material: material,
                    width: scaledWidth,
                    distanceDisplayCondition: new window.Cesium.DistanceDisplayCondition(0, scaledDistance)
                },
                //label: label,
                originalData: pipeline
            };

        }
    }
}

const setupPipelines = (pipelines) => {
    const dataSource = new window.Cesium.CustomDataSource("Pipeline");
    pipelines.forEach(i => dataSource.entities.add(mapPipeline(i)));
    return dataSource;
}

const mapWindfarm = (windfarm) => {
    if (!windfarm.LONGITUDE || !windfarm.LATITUDE) return;

    return {
        id: windfarm["Name"],
        name: windfarm["Name"],
        position: window.Cesium.Cartesian3.fromDegrees(windfarm.LONGITUDE, windfarm.LATITUDE),
        point: {
            pixelSize: 6,
            color: window.Cesium.Color.WHITE,
            eyeOffset: new window.Cesium.Cartesian3(0, 0, 1),
            distanceDisplayCondition: new window.Cesium.DistanceDisplayCondition(0.0, 8500009.5),
            translucencyByDistance: new window.Cesium.NearFarScalar(2300009.5, 1, 8500009.5, 0.01),
            heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND,
            outlineColor: window.Cesium.Color.BLACK,
            outlineWidth: 1,
        },
        label: {
            text: windfarm["Name"],
            fillColor: window.Cesium.Color.WHITE,
            style: window.Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineColor: window.Cesium.Color.BLACK,
            outlineWidth: 1.5,
            pixelOffset: new window.Cesium.Cartesian2(25, 0),
            verticalOrigin: window.Cesium.VerticalOrigin.CENTER,
            horizontalOrigin: window.Cesium.HorizontalOrigin.LEFT,
            distanceDisplayCondition: new window.Cesium.DistanceDisplayCondition(0.0, 180000),
            heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND
        },
        originalData: windfarm
    };
}

const setupWindfarms = (windfarms) => {
    const dataSource = new window.Cesium.CustomDataSource("Windfarm");
    windfarms.forEach(i => dataSource.entities.add(mapWindfarm(i)));
    return dataSource;
}

const getFieldColour = (field) => {
    let hcType = field["Hydrocarbon Type"];
    if (hcType) {
        hcType = hcType.toLowerCase();
    }
    let colour = fieldColours[hcType];
    if (!colour) {
        colour = fieldColours["default"];
    }
    colour = colour.withAlpha(0.7);

    return colour;
}

const mapField = (field) => {
    if (field.Coordinates) {
        let start = field["Discovery Date"];
        let end;;

        if (start) {
            start = window.Cesium.JulianDate.fromDate(new Date(start));
        }
        else {
            start = window.Cesium.JulianDate.fromDate(new Date("1901"));
        }

        if (end) {
            end = window.Cesium.JulianDate.fromDate(new Date(end));
        }
        else {
            end = window.Cesium.JulianDate.fromDate(new Date("2500"));
        }

        let availability = null;
        if (start || end) {
            const interval = new window.Cesium.TimeInterval({
                start: start,
                stop: end,
                isStartIncluded: start !== null,
                isStopIncluded: end !== null
            });
            availability = new window.Cesium.TimeIntervalCollection([interval]);
        }

        const material = getFieldColour(field);
        const flatCoordinates = field.Coordinates.flat();
        return {
            id: field["Field Name"],
            name: field["Field Name"],
            availability: availability,
            polygon: {
                hierarchy: window.Cesium.Cartesian3.fromDegreesArray(flatCoordinates),
                height: 0,
                material: material,
                heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND,
            },
            originalData: field
        };
    }
}

const setupFields = (fields) => {
    const dataSource = new window.Cesium.CustomDataSource("Field");
    fields.forEach(i => dataSource.entities.add(mapField(i)));
    return dataSource;
}

const setupBlocks = async () => {
    let scale = new window.Cesium.NearFarScalar(1.5e2, 1.5, 8.0e6, 0.0);
    let dataSource = await window.Cesium.GeoJsonDataSource.load(ukBlocks, {
        fill: window.Cesium.Color.TRANSPARENT,
        stroke: window.Cesium.Color.LIGHTCORAL
    });

    var p = dataSource.entities.values;
    for (var i = 0; i < p.length; i++) {
        let entity = p[i];
        let polygon = entity.polygon;
        if (polygon) {
            var center = window.Cesium.BoundingSphere.fromPoints(entity.polygon.hierarchy.getValue().positions).center;
            window.Cesium.Ellipsoid.WGS84.scaleToGeodeticSurface(center, center);
            entity.position = new window.Cesium.ConstantPositionProperty(center);;
        }
        entity.label = new window.Cesium.LabelGraphics({
            text: entity.properties.ALL_LABELS,
            distanceDisplayCondition: new window.Cesium.DistanceDisplayCondition(0.0, 400000),
            font: '12px sans-serif',
            scaleByDistance: scale
        });

    }
    return dataSource;
}

const leftClick = (viewer, history, location, search, e) => {
    const picked = viewer.scene.pick(e.position);
    const entity = picked ? picked.id || picked.primitive.id : null;
    if (entity && entity.entityCollection && entity.entityCollection.owner) {
        const type = entity.entityCollection.owner.name;
        const id = entity.id;
        search.set("eid", id);
        search.set("etype", type);
        history.push(location.pathname + `?${search.toString()}`);
    }
}

let previousPickedEntity;

const mouseMove = (viewer, setHover, movement) => {
    const element = viewer.container;
    const picked = viewer.scene.pick(movement.endPosition);
    const entity = picked ? picked.id || picked.primitive.id : null;

    // Highlight the currently picked entity
    if (entity && entity.entityCollection && entity.entityCollection.owner) {
        if (previousPickedEntity !== entity) {
            element.style.cursor = 'pointer';
            previousPickedEntity = entity;
            if (entity.originalData) {
                setHover({ entity: entity.originalData, type: entity.entityCollection.owner.name });
            }
        }
    } else {
        element.style.cursor = 'default';
        if (!previousPickedEntity) {
            setHover(null);
        }
        previousPickedEntity = null;
    }
}

const flyTo = (viewer, {west, south, east, north, pitch}) => {
    var rectangle = window.Cesium.Rectangle.fromDegrees(west, south, east, north);
    viewer.camera.flyTo({
        destination: rectangle,
        duration: 3,
        orientation: {
            heading: 0.0,
            pitch: window.Cesium.Math.toRadians(pitch),
            roll: 0.0
        }
    });
}

const CesiumMap = () => {
    const [{ installations, pipelines, windfarms, decomYards, fields, showInstallations, areas, showPipelines, showWindfarms, showDecomYards, showFields, showBlocks, year },] = useStateValue();
    const cesiumRef = useRef(null);
    const [viewer, setViewer] = useState(null);
    const location = useLocation();
    const history = useHistory();
    const search = new URLSearchParams(location.search);
    const eid = search.get("eid");
    const etype = search.get("etype");
    const [hover, setHover] = useState(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (!viewer) return;
        switch (etype) {
            case "Area":
                let area = areas.get(eid);
                if (area && area.coordinates) {
                    flyTo(viewer,area.coordinates);
                }
                break;
            default:

                const dataSources = viewer.dataSources.getByName(etype);
                if (dataSources.length !== 0) {
                    const entity = dataSources[0].entities.getById(eid);
                    if (entity) {
                        viewer.flyTo(entity);
                    }
                }
                break;
        }

    }, [viewer, areas, eid, etype]);

    useEffect(() => {
        if (!viewer) return;
        const installation = viewer.dataSources.getByName("Installation");
        if (installation.length > 0) installation[0].show = showInstallations;
        const pipeline = viewer.dataSources.getByName("Pipeline");
        if (pipeline.length > 0) pipeline[0].show = showPipelines;
        const windfarms = viewer.dataSources.getByName("Windfarm");
        if (windfarms.length > 0) windfarms[0].show = showWindfarms;
        const decomYards = viewer.dataSources.getByName("DecomYard");
        if (decomYards.length > 0) decomYards[0].show = showDecomYards;
        const fields = viewer.dataSources.getByName("Field");
        if (fields.length > 0) fields[0].show = showFields;
        const blocks = viewer.dataSources.getByName("Block");
        if (blocks.length > 0) blocks[0].show = showBlocks;
        viewer.scene.requestRender();
    }, [viewer, showInstallations, showPipelines, showWindfarms, showDecomYards, showFields, showBlocks]);

    useEffect(() => {
        if (viewer) {
            viewer.clockViewModel.currentTime = new window.Cesium.JulianDate.fromIso8601("" + year);
        }
    }, [viewer, year]);

    useEffect(() => {
        const viewer = setupCesium(cesiumRef);
        setViewer(viewer);
        flyHome(viewer);
        setupBlocks().then(dataSource => { dataSource.show = showBlocks; dataSource.name = "Block"; viewer.dataSources.add(dataSource) });
    }, []);

    useEffect(() => {
        if (!viewer) return;
        viewer.screenSpaceEventHandler.removeInputAction(window.Cesium.ScreenSpaceEventType.LEFT_CLICK);
        viewer.screenSpaceEventHandler.removeInputAction(window.Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        viewer.screenSpaceEventHandler.setInputAction((e) => leftClick(viewer, history, location, search, e), window.Cesium.ScreenSpaceEventType.LEFT_CLICK);
        viewer.screenSpaceEventHandler.setInputAction((e) => mouseMove(viewer, setHover, e), window.Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }, [viewer, history, location, search]);

    useEffect(() => {
        if (!viewer || installations.size === 0) return;
        const dataSource = setupInstallations(installations);
        dataSource.show = showInstallations;
        viewer.dataSources.add(dataSource);
    }, [viewer, installations]);

    useEffect(() => {
        if (!viewer || decomYards.size === 0) return;
        const dataSource = setupDecomyards(decomYards);
        dataSource.show = showDecomYards;
        viewer.dataSources.add(dataSource);
    }, [viewer, decomYards]);

    useEffect(() => {
        if (!viewer || pipelines.size === 0) return;
        const dataSource = setupPipelines(pipelines);
        dataSource.show = showPipelines;
        viewer.dataSources.add(dataSource);
    }, [viewer, pipelines]);

    useEffect(() => {
        if (!viewer || windfarms.size === 0) return;
        const dataSource = setupWindfarms(windfarms);
        dataSource.show = showWindfarms;
        viewer.dataSources.add(dataSource);
    }, [viewer, windfarms]);

    useEffect(() => {
        if (!viewer || fields.size === 0) return;
        const dataSource = setupFields(fields);
        dataSource.show = showFields;
        viewer.dataSources.add(dataSource);
    }, [viewer, fields]);

    return (
        <div style={{ width: '100%', height: '100%' }} onMouseMove={(e => { if (hover) { setPosition({ x: e.nativeEvent.offsetX + 5, y: e.nativeEvent.offsetY + 5 }) } })}>
            {hover && <HoverCard position={position} type={hover.type} entity={hover.entity} />}
            <div id="cesiumContainer" ref={cesiumRef} />
        </div >
    );
}

export default CesiumMap;

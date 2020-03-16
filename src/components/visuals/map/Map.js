import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

import './Map.scss';
import { useStateValue } from '../../../utils/state';
import HoverCard from './HoverCard';

const bathymetryBaseUrl = process.env.NODE_ENV === 'development' ? 'https://tiles.emodnet-bathymetry.eu/v9/terrain' : 'https://emodnet-terrain.azureedge.net/v9/terrain';
const assetsBaseUrl = process.env.NODE_ENV === 'development' ? 'https://digitalnorthsea.blob.core.windows.net' : 'https://assets.digitalnorthsea.com';
const ukBlocks = assetsBaseUrl + "/data/uk_blocks.json";

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

const pipelineColoursSimple = {
    "default": window.Cesium.Color.fromCssColorString("#DCDCDC")
}

const installationColours = {
    "removed": window.Cesium.Color.GOLDENROD,
    "default": window.Cesium.Color.GOLD
}

const installationColoursSimple = {
    "removed": window.Cesium.Color.DIMGREY,
    "default": window.Cesium.Color.DIMGREY
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

let heightReference = window.Cesium.HeightReference.NONE;

const dynamicHeightReference = new window.Cesium.CallbackProperty(function () {
    return heightReference;
}, false);

const terrainProvider = new window.Cesium.CesiumTerrainProvider({
    url: bathymetryBaseUrl,
    credit: "EMODnet Bathymetry Consortium (2018): EMODnet Digital Bathymetry (DTM)"
});

const defaultTerrainProvider = new window.Cesium.EllipsoidTerrainProvider();

const setupCesium = (cesiumRef) => {

    const simpleImagery = new window.Cesium.UrlTemplateImageryProvider({
        url: 'https://api.maptiler.com/maps/5a1e1d94-c972-4199-a26d-2f55f9abeb14/{z}/{x}/{y}.png?key=FSzrABzSMJXbH2n6FfZc',
        tileWidth: 512,
        tileHeight: 512,
        credit: new window.Cesium.Credit('<a href="https://www.maptiler.com/copyright/" target="_blank">© MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>', true)
    });

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
            requestRenderMode: true,
            imageryProvider: simpleImagery,
            terrainProvider: defaultTerrainProvider,
            sceneMode: window.Cesium.SceneMode.SCENE3D
        });


    const sateliteImagery = new window.Cesium.MapboxImageryProvider({
        mapId: 'mapbox.satellite',
        accessToken: 'pk.eyJ1IjoidW5hc3lzIiwiYSI6ImNqenR6MnBmMTA5dG4zbm80anEwdXVkaWUifQ.fzndysGAsyLbY8UyAMPMLQ'
    });

    const satelliteLayer = viewer.imageryLayers.addImageryProvider(sateliteImagery);
    satelliteLayer.show = false;
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

const setupRadius = (viewer) => {
    viewer.entities.add({
        id: "SOI",
        name: "SOI",
        ellipse: {
            semiMinorAxis: 10000,
            semiMajorAxis: 10000,
            fill: true,
            material: window.Cesium.Color.GREEN.withAlpha(0.3),
            zIndex: 99
        }
    });
}

const changeRadiusSize = (viewer, size) => {
    const radius = viewer.entities.getById("SOI");
    if (radius) {
        if (size === 0) {
            radius.show = false;
        } else {
            radius.ellipse.semiMinorAxis = size;
            radius.ellipse.semiMajorAxis = size;
            radius.show = true;
        }

        viewer.scene.requestRender();
    }
}

const moveRadius = (viewer, position) => {
    const radius = viewer.entities.getById("SOI");
    if (radius) {
        radius.position = position;
    }
    viewer.scene.requestRender();
}

const groupBy = function (xs, key) {
    return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};

const minBy = (arr, iteratee) => {
    const func = typeof iteratee === 'function' ? iteratee : item => item[iteratee]
    const min = Math.min(...arr.map(func))
    return arr.find(item => func(item) === min)
}

const nearestPosition = (entity, position) => {
    if (entity.positions) {
        return minBy(entity.positions, p => {
            const startCartographicPoint = window.Cesium.Cartographic.fromCartesian(p);
            const endCartographicPoint = window.Cesium.Cartographic.fromCartesian(position);
            const ellipsoidGeodesic = new window.Cesium.EllipsoidGeodesic(startCartographicPoint, endCartographicPoint);
            return ellipsoidGeodesic.surfaceDistance;
        });
    }

    return entity.position.getValue();
}

const findEntitiesInRange = (viewer, radiusDistance, dispatch) => {
    const radius = viewer.entities.getById("SOI");
    if (radius) {
        const position = radius.position?.getValue();
        if (radiusDistance === 0 || !position) {
            dispatch({ type: "clearWithIn" });
        } else {
            const withIn = [];
            for (let i = 0; i < viewer.dataSources.length; i++) {
                const dataSource = viewer.dataSources.get(i);
                dataSource.entities.values.forEach(entity => {
                    if (!entity.position || !entity.originalData) return;
                    const startCartographicPoint = window.Cesium.Cartographic.fromCartesian(nearestPosition(entity, position));
                    const endCartographicPoint = window.Cesium.Cartographic.fromCartesian(position);
                    const ellipsoidGeodesic = new window.Cesium.EllipsoidGeodesic(startCartographicPoint, endCartographicPoint);
                    const distance = ellipsoidGeodesic.surfaceDistance;
                    const distanceAbs = Math.abs(distance);
                    const entityToAdd = { entity: entity.originalData, distance: distanceAbs, type: dataSource.name };
                    if (distanceAbs <= radiusDistance) {
                        withIn.push(entityToAdd);
                    }
                });
            }

            dispatch({ type: "setWithIn", withIn: groupBy(withIn, "type") });
        }
    }
}

const scaleBetween = (unscaledNum, minAllowed, maxAllowed, min, max) => {
    return (maxAllowed - minAllowed) * (unscaledNum - min) / (max - min) + minAllowed;
}

const getInstallationColour = (mapStyle, installation) => {
    let colours = installationColoursSimple;
    if (mapStyle === "satellite") {
        colours = installationColours;
    }

    let status = installation.Status;
    if (status) {
        status = status.toLowerCase();
    }

    let colour = colours[status];
    if (!colour) {
        colour = colours["default"];
    }

    return colour;
}

const mapInstallation = (mapStyle, installation) => {
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
        pixelSize: 4,
        color: getInstallationColour(mapStyle, installation),
        eyeOffset: new window.Cesium.Cartesian3(0, 0, 1),
        distanceDisplayCondition: new window.Cesium.DistanceDisplayCondition(0.0, 8500009.5),
        translucencyByDistance: new window.Cesium.NearFarScalar(2300009.5, 1, 8500009.5, 0.01),
        heightReference: dynamicHeightReference,
        zIndex: 60
    };

    const label = {
        text: installation.name,
        font: "20px Arial Narrow",
        fillColor: window.Cesium.Color.WHITE,
        style: window.Cesium.LabelStyle.FILL,
        outlineColor: window.Cesium.Color.BLACK,
        outlineWidth: 1.5,
        pixelOffset: new window.Cesium.Cartesian2(25, 0),
        verticalOrigin: window.Cesium.VerticalOrigin.CENTER,
        horizontalOrigin: window.Cesium.HorizontalOrigin.LEFT,
        distanceDisplayCondition: new window.Cesium.DistanceDisplayCondition(0.0, 300000),
        heightReference: dynamicHeightReference,
        scale: 0.65,
        zIndex: 60
    };

    return {
        id: installation.id,
        name: installation.name,
        position: position,
        availability: availability,
        point: point,
        label: label,
        originalData: installation
    }
}

const setupInstallations = (mapStyle, installations) => {
    const dataSource = new window.Cesium.CustomDataSource("Installation");
    installations.forEach(i => dataSource.entities.add(mapInstallation(mapStyle, i)));
    return dataSource;
}

const mapDecomyard = (decomyard) => {
    const position = window.Cesium.Cartesian3.fromDegrees(decomyard.Long, decomyard.Lat);
    const point = {
        pixelSize: 4,
        color: window.Cesium.Color.STEELBLUE,
        eyeOffset: new window.Cesium.Cartesian3(0, 0, 1),
        distanceDisplayCondition: new window.Cesium.DistanceDisplayCondition(0.0, 8500009.5),
        translucencyByDistance: new window.Cesium.NearFarScalar(2300009.5, 1, 8500009.5, 0.01),
        heightReference: dynamicHeightReference,
        zIndex: 60
    };
    const label = {
        text: decomyard.name,
        fillColor: window.Cesium.Color.WHITE,
        style: window.Cesium.LabelStyle.FILL_AND_OUTLINE,
        outlineColor: window.Cesium.Color.BLACK,
        outlineWidth: 1.5,
        pixelOffset: new window.Cesium.Cartesian2(25, 0),
        verticalOrigin: window.Cesium.VerticalOrigin.Bottom,
        horizontalOrigin: window.Cesium.HorizontalOrigin.LEFT,
        distanceDisplayCondition: new window.Cesium.DistanceDisplayCondition(0.0, 180000),
        heightReference: dynamicHeightReference,
        zIndex: 60
    };
    return {
        id: decomyard.id,
        name: decomyard.name,
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

const mapSubsurface = (subsurface) => {
    const position = window.Cesium.Cartesian3.fromDegrees(subsurface.coordinates[0], subsurface.coordinates[1]);
    const point = {
        pixelSize: 4,
        color: window.Cesium.Color.MINTCREAM,
        eyeOffset: new window.Cesium.Cartesian3(0, 0, 1),
        distanceDisplayCondition: new window.Cesium.DistanceDisplayCondition(0.0, 8500009.5),
        translucencyByDistance: new window.Cesium.NearFarScalar(2300009.5, 1, 8500009.5, 0.01),
        heightReference: dynamicHeightReference,
        zIndex: 50
    };

    return {
        id: subsurface.id,
        name: subsurface.name,
        position: position,
        point: point,
        originalData: subsurface
    }
}

const setupSubsurfaces = (subsurfaces) => {
    const dataSource = new window.Cesium.CustomDataSource("Subsurface");
    subsurfaces.forEach(i => dataSource.entities.add(mapSubsurface(i)));
    return dataSource;
}

const getPipelineColour = (mapStyle, pipeline) => {
    let colours = pipelineColoursSimple;
    if (mapStyle === "satellite") {
        colours = pipelineColours;
    }

    let pipelineFluid = pipeline["Fluid Conveyed"];
    if (pipelineFluid) {
        pipelineFluid = pipelineFluid.toLowerCase();
    }

    let colour = colours[pipelineFluid];
    if (!colour) {
        colour = colours["default"];
    }

    if (pipeline["Status"] !== "ACTIVE") {
        colour = colour.withAlpha(0.5);
    }

    colour = colour.darken(0.5, new window.Cesium.Color());

    return colour;
}

const updatePipelineStyle = (mapStyle, pipelines) => {
    pipelines.forEach(pipeline => {
        if (pipeline.originalData && pipeline.polyline) {
            pipeline.polyline.material = getPipelineColour(mapStyle, pipeline.originalData);
        }
    });
}

const updateInstallationStyle = (mapStyle, installations) => {
    installations.forEach(installation => {
        if (installation.originalData) {
            installation.point.color = getInstallationColour(mapStyle, installation.originalData);
        }
    });
}


const setupPipelines = async (pipelines) => {
    const minDiameter = 0;
    const maxDiameter = 1058;
    const features = [...pipelines.values()].map(pipeline => ({ type: "Feature", id: pipeline.id, name: pipeline.name, geometry: pipeline.Geometry, properties: { id: pipeline.id } }));
    const geoJson = { type: "FeatureCollection", features: features };
    let dataSource = await window.Cesium.GeoJsonDataSource.load(geoJson);
    dataSource.name = "Pipeline";
    var p = dataSource.entities.values;
    for (var i = 0; i < p.length; i++) {
        const entity = p[i];
        const rawEntity = pipelines.get(entity.properties.id?.getValue()?.toString());
        if (rawEntity) {
            entity.originalData = rawEntity;


            let start = rawEntity["start_date"];
            if (start) {
                start = window.Cesium.JulianDate.fromDate(new Date(start));
            }
            else {
                start = window.Cesium.JulianDate.fromDate(new Date("1901"));
            }
            let end = rawEntity["end_date"];
            if (end) {
                end = window.Cesium.JulianDate.fromDate(new Date(end));
            }
            else {
                end = window.Cesium.JulianDate.fromDate(new Date("2500"));
            }

            if (start || end) {
                const interval = new window.Cesium.TimeInterval({
                    start: start,
                    stop: end,
                    isStartIncluded: start !== null,
                    isStopIncluded: end !== null
                });
                entity.availability = new window.Cesium.TimeIntervalCollection([interval]);
            }

            const pipeDiameter = parseInt(rawEntity.diameter_value) || 0

            //const scaledWidth = scaleBetween(pipeDiameter, 0.5, 1, minDiameter, maxDiameter);
            const scaledDistance = scaleBetween(pipeDiameter, 150000, 50000000, minDiameter, maxDiameter);

            if (entity.polyline) {
                entity.polyline.material = getPipelineColour("satellite", rawEntity);
                entity.polyline.width = 2;
                entity.polyline.distanceDisplayCondition = new window.Cesium.DistanceDisplayCondition(0, scaledDistance);
                entity.polyline.zIndex = 50;
                entity.polyline.clampToGround = true;
            }
        }

    }
    return dataSource;
}

const setupWindfarms = async (windfarms) => {
    const features = [...windfarms.values()].map(windfarm => ({ type: "Feature", id: windfarm.id, name: windfarm.name, geometry: windfarm.Geometry, properties: { id: windfarm.id } }));
    const geoJson = { type: "FeatureCollection", features: features };
    let dataSource = await window.Cesium.GeoJsonDataSource.load(geoJson);
    dataSource.name = "Windfarm";
    var p = dataSource.entities.values;
    for (var i = 0; i < p.length; i++) {
        const entity = p[i];
        if (entity.polygon) {
            entity.polygon.zIndex = 40;
        }
        const rawEntity = windfarms.get(entity.properties.id.getValue().toString());
        if (rawEntity) {
            entity.originalData = rawEntity;
        }

    }
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

const setupFields = async (fields) => {
    const features = [...fields.values()].map(field => ({ type: "Feature", id: field.id, name: field.name, geometry: field.Geometry, properties: { id: field.id } }));
    const geoJson = { type: "FeatureCollection", features: features };
    let dataSource = await window.Cesium.GeoJsonDataSource.load(geoJson);
    dataSource.name = "Field";
    var p = dataSource.entities.values;
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

                if (start || end) {
                    const interval = new window.Cesium.TimeInterval({
                        start: start,
                        stop: end,
                        isStartIncluded: start !== null,
                        isStopIncluded: end !== null
                    });
                    entity.availability = new window.Cesium.TimeIntervalCollection([interval]);
                }

                const material = getFieldColour(rawEntity);
                entity.polygon.material = material;
                entity.polygon.outline = false;
            }
        }
    }
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
            polygon.zIndex = 30;
            var center = window.Cesium.BoundingSphere.fromPoints(entity.polygon.hierarchy.getValue().positions).center;
            window.Cesium.Ellipsoid.WGS84.scaleToGeodeticSurface(center, center);
            entity.position = new window.Cesium.ConstantPositionProperty(center);
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

const setupWells = async (wells) => {
    const features = [...wells.values()].map(well => ({ type: "Feature", id: well.id, name: well.name, geometry: well.Geometry, properties: { id: well.id } }));
    const geoJson = { type: "FeatureCollection", features: features };
    let dataSource = await window.Cesium.GeoJsonDataSource.load(geoJson);
    dataSource.name = "Well";
    var p = dataSource.entities.values;
    for (var i = 0; i < p.length; i++) {
        const entity = p[i];
        if (entity.billboard) {
            entity.billboard = undefined;
            entity.point = new window.Cesium.PointGraphics({
                pixelSize: 4,
                color: window.Cesium.Color.BLACK,
                distanceDisplayCondition: new window.Cesium.DistanceDisplayCondition(0.0, 8500009.5),
                translucencyByDistance: new window.Cesium.NearFarScalar(2300009.5, 1, 8500009.5, 0.01),
                heightReference: dynamicHeightReference,
                zIndex: 50
            });
        }

        const rawEntity = wells.get(entity.properties.id.getValue().toString());
        if (rawEntity) {
            entity.originalData = rawEntity;
        }

    }
    return dataSource;
}

const setupWrecks = async (wrecks) => {
    const features = [...wrecks.values()].map(wreck => ({ type: "Feature", id: wreck.id, name: wreck.name, geometry: wreck.Geometry, properties: { id: wreck.id } }));
    const geoJson = { type: "FeatureCollection", features: features };
    let dataSource = await window.Cesium.GeoJsonDataSource.load(geoJson);
    dataSource.name = "Wreck";
    var p = dataSource.entities.values;
    for (var i = 0; i < p.length; i++) {
        const entity = p[i];
        if (entity.billboard) {
            entity.billboard = undefined;
            entity.point = new window.Cesium.PointGraphics({
                pixelSize: 4,
                color: window.Cesium.Color.SLATEGREY,
                distanceDisplayCondition: new window.Cesium.DistanceDisplayCondition(0.0, 8500009.5),
                translucencyByDistance: new window.Cesium.NearFarScalar(2300009.5, 1, 8500009.5, 0.01),
                heightReference: dynamicHeightReference,
                zIndex: 50
            });
        }
        const rawEntity = wrecks.get(entity.properties.id.getValue().toString());
        if (rawEntity) {
            entity.originalData = rawEntity;
        }

    }
    return dataSource;
}

const setupAreas = async (areas) => {
    let scale = new window.Cesium.NearFarScalar(1.5e2, 1.5, 8.0e6, 0.0);
    const features = [...areas.values()].map(area => ({ type: "Feature", id: area.id, name: area.name, geometry: area.Geometry, properties: { id: area.id } }));
    const geoJson = { type: "FeatureCollection", features: features };
    let dataSource = await window.Cesium.GeoJsonDataSource.load(geoJson);
    dataSource.name = "Area";
    var p = dataSource.entities.values;
    for (var i = 0; i < p.length; i++) {
        const entity = p[i];
        let polygon = entity.polygon;
        const rawEntity = areas.get(entity.properties.id.getValue().toString());
        if (rawEntity) {
            entity.originalData = rawEntity;
        }
        if (polygon) {
            polygon.zIndex = 1;
            if (rawEntity) {
                try {
                    const colour = window.Cesium.Color.fromCssColorString(rawEntity.Colour);
                    polygon.material = colour.withAlpha(0.7);
                    polygon.outlineColor = colour;

                } catch (e) {
                }

            }
            var center = window.Cesium.BoundingSphere.fromPoints(entity.polygon.hierarchy.getValue().positions).center;
            window.Cesium.Ellipsoid.WGS84.scaleToGeodeticSurface(center, center);
            entity.position = new window.Cesium.ConstantPositionProperty(center);
        }
        entity.label = new window.Cesium.LabelGraphics({
            text: entity.name,
            distanceDisplayCondition: new window.Cesium.DistanceDisplayCondition(0.0, 400000),
            font: '12px sans-serif',
            scaleByDistance: scale
        });
    }
    return dataSource;
}

const setupBasins = async (basins) => {
    let scale = new window.Cesium.NearFarScalar(1.5e2, 1.5, 8.0e6, 0.0);
    const features = [...basins.values()].map(basin => ({ type: "Feature", id: basin.id, name: basin.name, geometry: basin.Geometry, properties: { id: basin.id } }));
    const geoJson = { type: "FeatureCollection", features: features };
    let dataSource = await window.Cesium.GeoJsonDataSource.load(geoJson);
    dataSource.name = "Basin";
    var p = dataSource.entities.values;
    for (var i = 0; i < p.length; i++) {
        const entity = p[i];
        const rawEntity = basins.get(entity.properties.id.getValue().toString());
        if (rawEntity) {
            entity.originalData = rawEntity;
        }
        let polygon = entity.polygon;
        if (polygon) {
            polygon.zIndex = 20;
            if (rawEntity) {
                try {
                    const colour = window.Cesium.Color.fromCssColorString(rawEntity.Colour);
                    polygon.material = colour.withAlpha(0.6);
                    polygon.outlineColor = colour;
                } catch (e) {
                }
            }
            var center = window.Cesium.BoundingSphere.fromPoints(entity.polygon.hierarchy.getValue().positions).center;
            window.Cesium.Ellipsoid.WGS84.scaleToGeodeticSurface(center, center);
            entity.position = new window.Cesium.ConstantPositionProperty(center);
        }

        entity.label = new window.Cesium.LabelGraphics({
            text: entity.name,
            distanceDisplayCondition: new window.Cesium.DistanceDisplayCondition(0.0, 400000),
            font: '12px sans-serif',
            scaleByDistance: scale
        });
    }
    return dataSource;
}

const leftClick = (viewer, distance, history, location, search, dispatch, e) => {
    var position = viewer.camera.pickEllipsoid(e.position);
    var cartographicPosition = window.Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);
    var y = cartographicPosition.latitude;
    var x = cartographicPosition.longitude;
    let pos = window.Cesium.Cartesian3.fromRadians(x, y)
    const picked = viewer.scene.pick(e.position);
    const entity = picked ? picked.id || picked.primitive.id : null;
    if (entity && entity.entityCollection && entity.entityCollection.owner && entity.entityCollection.owner.name) {
        const type = entity.entityCollection.owner.name;
        const id = entity.originalData?.id;
        search.set("eid", id);
        search.set("etype", type);
        history.push(location.pathname + `?${search.toString()}`);
    }

    moveRadius(viewer, pos);
    findEntitiesInRange(viewer, distance, dispatch)
}

let previousPickedEntity;

const mouseMove = (viewer, setHover, movement) => {
    const element = viewer.container;
    const picked = viewer.scene.pick(movement.endPosition);
    const entity = picked ? picked.id || picked.primitive.id : null;

    // Highlight the currently picked entity
    if (entity && entity.entityCollection && entity.entityCollection.owner) {
        if (previousPickedEntity !== entity) {
            previousPickedEntity = entity;
            if (entity.originalData) {
                element.style.cursor = 'pointer';
                setHover({ entity: entity.originalData, type: entity.entityCollection.owner.name });
            } else {
                setHover(null);
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

const toggleEntityVisibility = (viewer, dataSourceName, visibilityList) => {
    const dataSources = viewer.dataSources.getByName(dataSourceName);
    if (dataSources.length > 0) {
        const dataSource = dataSources[0];
        dataSource.entities.values.forEach(entity => entity.show = visibilityList.includes(entity.id));
    }
    viewer.scene.requestRender();
}

const switchStyle = (viewer, mapStyle) => {
    switch (mapStyle) {
        case "satellite": {
            viewer.imageryLayers.get(1).show = true;
            viewer.imageryLayers.get(0).show = false;
            break;
        }
        default: {
            viewer.imageryLayers.get(0).show = true;
            viewer.imageryLayers.get(1).show = false;
            break;
        }
    }

    const pipelines = viewer.dataSources.getByName("Pipeline");
    if (pipelines.length > 0) {
        updatePipelineStyle(mapStyle, pipelines[0].entities.values);
    }

    const installations = viewer.dataSources.getByName("Installation");
    if (installations.length > 0) {
        updateInstallationStyle(mapStyle, installations[0].entities.values);
    }
}

const CesiumMap = () => {
    const [{ installations, pipelines, windfarms, decomYards, fields, subsurfaces, wells, wrecks, areas, basins,
        showInstallations, showPipelines, showWindfarms, showDecomYards, showFields, showSubsurfaces, showBlocks, showWells, showWrecks, showAreas, showBasins, year,
        installationsVisible, pipelinesVisible, windfarmsVisible, fieldsVisible, subsurfacesVisible, wellsVisible, decomnYardsVisible, wrecksVisible, areasVisible, basinsVisible,
        mapStyle, enableTerrain, globe3D, radius }, dispatch] = useStateValue();
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
        switchStyle(viewer, mapStyle);
    }, [viewer, mapStyle]);

    useEffect(() => {
        if (!viewer) return;
        switch (etype) {
            case "Area":
            case "Basin":
            case "Pipeline": {
                const dataSources = viewer.dataSources.getByName(etype);
                if (dataSources.length !== 0) {
                    const entity = dataSources[0].entities.getById(eid);
                    if (entity) {
                        viewer.flyTo(entity);
                    }
                }
                break;
            }
            default: {
                const dataSources = viewer.dataSources.getByName(etype);
                if (dataSources.length !== 0) {
                    const entity = dataSources[0].entities.getById(eid);
                    if (entity) {
                        viewer.flyTo(entity, {
                            offset: new window.Cesium.HeadingPitchRange(0, -window.Cesium.Math.PI_OVER_FOUR, 50000)
                        });
                    }
                }
                break;
            }
        }

    }, [viewer, areas, eid, etype]);

    useEffect(() => {
        if (!viewer || !installationsVisible) return;
        toggleEntityVisibility(viewer, "Installation", installationsVisible);
    }, [viewer, installationsVisible]);

    useEffect(() => {
        if (!viewer || !pipelinesVisible) return;
        toggleEntityVisibility(viewer, "Pipeline", pipelinesVisible);
    }, [viewer, pipelinesVisible]);

    useEffect(() => {
        if (!viewer || !windfarmsVisible) return;
        toggleEntityVisibility(viewer, "Windfarm", windfarmsVisible);
    }, [viewer, windfarmsVisible]);

    useEffect(() => {
        if (!viewer || !fieldsVisible) return;
        toggleEntityVisibility(viewer, "Field", fieldsVisible);
    }, [viewer, fieldsVisible]);

    useEffect(() => {
        if (!viewer || !subsurfacesVisible) return;
        toggleEntityVisibility(viewer, "Subsurface", subsurfacesVisible);
    }, [viewer, subsurfacesVisible]);

    useEffect(() => {
        if (!viewer || !decomnYardsVisible) return;
        toggleEntityVisibility(viewer, "DecomYard", decomnYardsVisible);
    }, [viewer, decomnYardsVisible]);

    useEffect(() => {
        if (!viewer || !wellsVisible) return;
        toggleEntityVisibility(viewer, "Well", wellsVisible);
    }, [viewer, wellsVisible]);

    useEffect(() => {
        if (!viewer || !wrecksVisible) return;
        toggleEntityVisibility(viewer, "Wreck", wrecksVisible);
    }, [viewer, wrecksVisible]);
    useEffect(() => {
        if (!viewer || !areasVisible) return;
        toggleEntityVisibility(viewer, "Area", areasVisible);
    }, [viewer, areasVisible]);
    useEffect(() => {
        if (!viewer || !basinsVisible) return;
        toggleEntityVisibility(viewer, "Basin", basinsVisible);
    }, [viewer, basinsVisible]);

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
        const subsurfaces = viewer.dataSources.getByName("Subsurface");
        if (subsurfaces.length > 0) subsurfaces[0].show = showSubsurfaces;
        const blocks = viewer.dataSources.getByName("Block");
        if (blocks.length > 0) blocks[0].show = showBlocks;
        const wells = viewer.dataSources.getByName("Well");
        if (wells.length > 0) wells[0].show = showWells;
        const wrecks = viewer.dataSources.getByName("Wreck");
        if (wrecks.length > 0) wrecks[0].show = showWrecks;
        const areas = viewer.dataSources.getByName("Area");
        if (areas.length > 0) areas[0].show = showAreas;
        const basins = viewer.dataSources.getByName("Basin");
        if (basins.length > 0) basins[0].show = showBasins;
        viewer.scene.requestRender();
    }, [viewer, showInstallations, showPipelines, showWindfarms, showDecomYards, showFields, showBlocks, showSubsurfaces, showWells, showWrecks, showAreas, showBasins]);

    useEffect(() => {
        if (viewer) {
            viewer.clockViewModel.currentTime = new window.Cesium.JulianDate.fromIso8601("" + year);
        }
    }, [viewer, year]);

    useEffect(() => {
        if (!viewer) return;
        if (enableTerrain) {
            viewer.terrainProvider = terrainProvider;
            heightReference = window.Cesium.HeightReference.CLAMP_TO_GROUND;
        } else {
            viewer.terrainProvider = defaultTerrainProvider;
            heightReference = window.Cesium.HeightReference.NONE;
        }
    }, [viewer, enableTerrain]);

    useEffect(() => {
        if (!viewer) return;
        if (globe3D) {
            viewer.scene.morphTo3D();
        } else {
            viewer.scene.morphTo2D();
        }
    }, [viewer, globe3D]);

    useEffect(() => {
        const viewer = setupCesium(cesiumRef);
        setViewer(viewer);
        setupRadius(viewer);
        flyHome(viewer);
        setupBlocks().then(dataSource => { dataSource.show = showBlocks; dataSource.name = "Block"; viewer.dataSources.add(dataSource) });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!viewer) return;
        viewer.screenSpaceEventHandler.removeInputAction(window.Cesium.ScreenSpaceEventType.LEFT_CLICK);
        viewer.screenSpaceEventHandler.removeInputAction(window.Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        viewer.screenSpaceEventHandler.setInputAction((e) => leftClick(viewer, radius, history, location, search, dispatch, e), window.Cesium.ScreenSpaceEventType.LEFT_CLICK);
        viewer.screenSpaceEventHandler.setInputAction((e) => mouseMove(viewer, setHover, e), window.Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }, [viewer, history, location, search, radius, dispatch]);

    useEffect(() => {
        if (viewer) {
            changeRadiusSize(viewer, radius);
            findEntitiesInRange(viewer, radius, dispatch)
        }
    }, [viewer, radius, dispatch]);

    useEffect(() => {
        if (!viewer || installations.size === 0) return;
        const dataSource = setupInstallations(mapStyle, installations);
        dataSource.show = showInstallations;
        viewer.dataSources.add(dataSource);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewer, installations]);

    useEffect(() => {
        if (!viewer || decomYards.size === 0) return;
        const dataSource = setupDecomyards(decomYards);
        dataSource.show = showDecomYards;
        viewer.dataSources.add(dataSource);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewer, decomYards]);

    useEffect(() => {
        if (!viewer || pipelines.size === 0) return;
        async function loadPipelines() {
            const dataSource = await setupPipelines(pipelines);
            dataSource.show = showPipelines;
            viewer.dataSources.add(dataSource);
        }
        loadPipelines();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewer, pipelines]);

    useEffect(() => {
        if (!viewer || windfarms.size === 0) return;
        const dataSource = setupWindfarms(windfarms);
        dataSource.show = showWindfarms;
        viewer.dataSources.add(dataSource);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewer, windfarms]);

    useEffect(() => {
        if (!viewer || fields.size === 0) return;
        async function loadFields() {
            const dataSource = await setupFields(fields);
            dataSource.show = showFields;
            viewer.dataSources.add(dataSource);
        }
        loadFields();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewer, fields]);

    useEffect(() => {
        if (!viewer || subsurfaces.size === 0) return;
        const dataSource = setupSubsurfaces(subsurfaces);
        dataSource.show = showSubsurfaces;
        viewer.dataSources.add(dataSource);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewer, subsurfaces]);

    useEffect(() => {
        if (!viewer || wells.size === 0) return;
        async function loadWells() {
            const dataSource = await setupWells(wells);
            dataSource.show = showWells;
            viewer.dataSources.add(dataSource);
        }
        loadWells();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewer, wells]);

    useEffect(() => {
        if (!viewer || wrecks.size === 0) return;
        async function loadWrecks() {
            const dataSource = await setupWrecks(wrecks);
            dataSource.show = showWrecks;
            viewer.dataSources.add(dataSource);
        }
        loadWrecks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewer, wrecks]);

    useEffect(() => {
        if (!viewer || areas.size === 0) return;
        async function loadAreas() {
            const dataSource = await setupAreas(areas);
            dataSource.show = showAreas;
            viewer.dataSources.add(dataSource);
        }
        loadAreas();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewer, areas]);

    useEffect(() => {
        if (!viewer || basins.size === 0) return;
        async function loadBasins() {
            const dataSource = await setupBasins(basins);
            dataSource.show = showBasins;
            viewer.dataSources.add(dataSource);
        }
        loadBasins();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewer, basins]);

    return (
        <div onMouseMove={(e => { if (hover) { setPosition({ x: e.nativeEvent.offsetX + 5, y: e.nativeEvent.offsetY + 5 }) } })}>
            {hover && <HoverCard position={position} type={hover.type} entity={hover.entity} />}
            <div id="cesiumContainer" ref={cesiumRef} />
        </div >
    );
}

export default CesiumMap;

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import './Map.scss';
import { useStateValue } from '../../utils/state';
import HoverCard from './HoverCard';
import { Color, HeightReference, CallbackProperty, CesiumTerrainProvider, EllipsoidTerrainProvider, UrlTemplateImageryProvider, Credit, Viewer, SceneMode, MapboxImageryProvider, Rectangle, Cartographic, EllipsoidGeodesic, GeoJsonDataSource, JulianDate, Cartesian3, DistanceDisplayCondition, NearFarScalar, LabelStyle, Cartesian2, VerticalOrigin, HorizontalOrigin, CustomDataSource, BoundingSphere, Ellipsoid, ConstantPositionProperty, LabelGraphics, PointGraphics, HeadingPitchRange, ScreenSpaceEventType, Math as CesiumMath } from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";
import { useInstallations } from './Installations';
import { usePipelines } from './Pipelines';
import { useFields } from './Fields';
import { useCCPiplines } from './CarbonCapturePipelines';
import { useCCFields } from './CarbonCaptureFields';
import { useWindfarms } from './Windfarms';
const bathymetryBaseUrl = process.env.NODE_ENV === 'development' ? 'https://tiles.emodnet-bathymetry.eu/v9/terrain' : 'https://emodnet-terrain.azureedge.net/v9/terrain';
const assetsBaseUrl = process.env.NODE_ENV === 'development' ? 'https://digitalnorthsea.blob.core.windows.net' : 'https://assets.digitalnorthsea.com';
const ukBlocks = assetsBaseUrl + "/data/uk_blocks.json";

let heightReference = HeightReference.NONE;

const dynamicHeightReference = new CallbackProperty(function () {
    return heightReference;
}, false);

const terrainProvider = new CesiumTerrainProvider({
    url: bathymetryBaseUrl,
    credit: "EMODnet Bathymetry Consortium (2018): EMODnet Digital Bathymetry (DTM)"
});

const defaultTerrainProvider = new EllipsoidTerrainProvider();

const setupCesium = (cesiumRef) => {

    const simpleImagery = new UrlTemplateImageryProvider({
        url: 'https://api.maptiler.com/maps/76ecac98-bde3-41d8-81ab-2b530ba0974b/{z}/{x}/{y}.png?key=FSzrABzSMJXbH2n6FfZc',
        tileWidth: 512,
        tileHeight: 512,
        credit: new Credit('<a href="https://www.maptiler.com/copyright/" target="_blank">© MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>', true)
    });

    const viewer =
        new Viewer(cesiumRef.current, {
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
            sceneMode: SceneMode.SCENE3D
        });


    const sateliteImagery = new MapboxImageryProvider({
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
    var rectangle = Rectangle.fromDegrees(west, south, east, north);
    // fly to the north sea
    viewer.camera.flyTo({
        destination: rectangle,
        duration: 3,
        orientation: {
            heading: 0.0,
            pitch: CesiumMath.toRadians(-50),
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
            material: Color.GREEN.withAlpha(0.3),
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
            const startCartographicPoint = Cartographic.fromCartesian(p);
            const endCartographicPoint = Cartographic.fromCartesian(position);
            const ellipsoidGeodesic = new EllipsoidGeodesic(startCartographicPoint, endCartographicPoint);
            return ellipsoidGeodesic.surfaceDistance;
        });
    }

    return entity.position.getValue(JulianDate.now());
}

const findEntitiesInRange = (viewer, radiusDistance, dispatch) => {
    const radius = viewer.entities.getById("SOI");
    const time = JulianDate.now();
    if (radius) {
        const position = radius.position?.getValue(time);
        if (radiusDistance === 0 || !position) {
            dispatch({ type: "clearWithIn" });
        } else {
            const withIn = [];
            for (let i = 0; i < viewer.dataSources.length; i++) {
                const dataSource = viewer.dataSources.get(i);
                dataSource.entities.values.forEach(entity => {
                    if (!entity.position || !entity.originalData) return;
                    const startCartographicPoint = Cartographic.fromCartesian(nearestPosition(entity, position));
                    const endCartographicPoint = Cartographic.fromCartesian(position);
                    const ellipsoidGeodesic = new EllipsoidGeodesic(startCartographicPoint, endCartographicPoint);
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



const mapDecomyard = (decomyard) => {
    const position = Cartesian3.fromDegrees(decomyard.Long, decomyard.Lat);
    const point = {
        pixelSize: 4,
        color: Color.STEELBLUE,
        eyeOffset: new Cartesian3(0, 0, 1),
        distanceDisplayCondition: new DistanceDisplayCondition(0.0, 8500009.5),
        translucencyByDistance: new NearFarScalar(2300009.5, 1, 8500009.5, 0.01),
        heightReference: dynamicHeightReference,
        zIndex: 60
    };
    const label = {
        text: decomyard.name,
        fillColor: Color.WHITE,
        style: LabelStyle.FILL_AND_OUTLINE,
        outlineColor: Color.BLACK,
        outlineWidth: 1.5,
        pixelOffset: new Cartesian2(25, 0),
        verticalOrigin: VerticalOrigin.Bottom,
        horizontalOrigin: HorizontalOrigin.LEFT,
        distanceDisplayCondition: new DistanceDisplayCondition(0.0, 180000),
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
    const dataSource = new CustomDataSource("DecomYard");
    decomyards.forEach(i => dataSource.entities.add(mapDecomyard(i)));
    return dataSource;
}

const mapSubsurface = (subsurface) => {
    const position = Cartesian3.fromDegrees(subsurface.coordinates[0], subsurface.coordinates[1]);
    const point = {
        pixelSize: 4,
        color: Color.MINTCREAM,
        eyeOffset: new Cartesian3(0, 0, 1),
        distanceDisplayCondition: new DistanceDisplayCondition(0.0, 8500009.5),
        translucencyByDistance: new NearFarScalar(2300009.5, 1, 8500009.5, 0.01),
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
    const dataSource = new CustomDataSource("Subsurface");
    subsurfaces.forEach(i => dataSource.entities.add(mapSubsurface(i)));
    return dataSource;
}

const setupWorkingGroups = async (workingGroups) => {
    const features = [...workingGroups.values()].map(workingGroup => ({ type: "Feature", id: workingGroup.id, name: workingGroup.name, geometry: workingGroup.Geometry, properties: { id: workingGroup.id } }));
    const geoJson = { type: "FeatureCollection", features: features };
    let dataSource = await GeoJsonDataSource.load(geoJson);
    dataSource.name = "WorkingGroup";
    var p = dataSource.entities.values;
    for (var i = 0; i < p.length; i++) {
        const entity = p[i];
        if (entity.polygon) {
            entity.polygon.zIndex = 40;
        }
        const rawEntity = workingGroups.get(entity.properties.id.getValue().toString());
        if (rawEntity) {
            entity.originalData = rawEntity;
        }

    }
    return dataSource;
}

const setupOnshoreWind = async (windfarms) => {
    const features = [...windfarms.values()].map(windfarm => ({ type: "Feature", id: windfarm.id, name: windfarm.name, geometry: windfarm.Geometry, properties: { id: windfarm.id } }));
    const geoJson = { type: "FeatureCollection", features: features };
    let dataSource = await GeoJsonDataSource.load(geoJson);
    dataSource.name = "OnshoreWindfarm";
    var p = dataSource.entities.values;

    for (var i = 0; i < p.length; i++) {
        const entity = p[i];

        if (entity.billboard) {
            entity.billboard = undefined;
            entity.point = {
                pixelSize: 4,
                color: Color.CADETBLUE,
                eyeOffset: new Cartesian3(0, 0, 1),
                distanceDisplayCondition: new DistanceDisplayCondition(0.0, 8500009.5),
                translucencyByDistance: new NearFarScalar(2300009.5, 1, 8500009.5, 0.01),
                heightReference: dynamicHeightReference,
                zIndex: 60
            };
        }

        const rawEntity = windfarms.get(entity.properties.id.getValue().toString());
        if (rawEntity) {
            entity.originalData = rawEntity;
        }

    }
    return dataSource;
}

const setupOnshoreGridCables = async (gridCables) => {
    const features = [...gridCables.values()].map(cable => ({ type: "Feature", id: cable.id, name: cable.name, geometry: cable.Geometry, properties: { id: cable.id } }));
    const geoJson = { type: "FeatureCollection", features: features };
    let dataSource = await GeoJsonDataSource.load(geoJson);
    dataSource.name = "OnshoreGridCable";
    var p = dataSource.entities.values;
    for (var i = 0; i < p.length; i++) {
        const entity = p[i];

        const rawEntity = gridCables.get(entity.properties.id.getValue().toString());
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
    return dataSource;
}

const setupOnshorePowerlines = async (powerlines) => {
    const features = [...powerlines.values()].map(powerline => ({ type: "Feature", id: powerline.id, name: powerline.name, geometry: powerline.Geometry, properties: { id: powerline.id } }));
    const geoJson = { type: "FeatureCollection", features: features };
    let dataSource = await GeoJsonDataSource.load(geoJson);
    dataSource.name = "OnshorePowerline";
    var p = dataSource.entities.values;
    for (var i = 0; i < p.length; i++) {
        const entity = p[i];

        const rawEntity = powerlines.get(entity.properties.id.getValue().toString());
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
    return dataSource;
}

const setupOnshoreGasPipes = async (pipes) => {
    const features = [...pipes.values()].map(pipe => ({ type: "Feature", id: pipe.id, name: pipe.name, geometry: pipe.Geometry, properties: { id: pipe.id } }));
    const geoJson = { type: "FeatureCollection", features: features };
    let dataSource = await GeoJsonDataSource.load(geoJson);
    dataSource.name = "OnshoreGasPipe";
    var p = dataSource.entities.values;
    for (var i = 0; i < p.length; i++) {
        const entity = p[i];

        const rawEntity = pipes.get(entity.properties.id.getValue().toString());
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
    return dataSource;
}

const setupOnshoreGasSites = async (sites) => {
    const features = [...sites.values()].map(site => ({ type: "Feature", id: site.id, name: site.name, geometry: site.Geometry, properties: { id: site.id } }));
    const geoJson = { type: "FeatureCollection", features: features };
    let dataSource = await GeoJsonDataSource.load(geoJson);
    dataSource.name = "OnshoreGasSite";
    var p = dataSource.entities.values;
    for (var i = 0; i < p.length; i++) {
        const entity = p[i];
        if (entity.polygon) {
            entity.polygon.zIndex = 40;
        }
        const rawEntity = sites.get(entity.properties.id.getValue().toString());
        if (rawEntity) {
            entity.originalData = rawEntity;
        }

    }
    return dataSource;
}



const setupBlocks = async () => {
    let scale = new NearFarScalar(1.5e2, 1.5, 8.0e6, 0.0);
    let dataSource = await GeoJsonDataSource.load(ukBlocks, {
        fill: Color.TRANSPARENT,
        stroke: Color.LIGHTCORAL
    });

    var p = dataSource.entities.values;
    for (var i = 0; i < p.length; i++) {
        let entity = p[i];
        let polygon = entity.polygon;
        if (polygon) {
            polygon.zIndex = 30;
            var center = BoundingSphere.fromPoints(entity.polygon.hierarchy.getValue().positions).center;
            Ellipsoid.WGS84.scaleToGeodeticSurface(center, center);
            entity.position = new ConstantPositionProperty(center);
        }
        entity.label = new LabelGraphics({
            text: entity.properties.ALL_LABELS,
            distanceDisplayCondition: new DistanceDisplayCondition(0.0, 400000),
            font: '20px Arial Narrow"',
            scaleByDistance: scale,
            fillColor: Color.BLACK,
            style: LabelStyle.FILL,
            outlineColor: Color.WHITE,
            outlineWidth: 1.5,

            heightReference: dynamicHeightReference,
            scale: 0.65,
            zIndex: 60
        });

    }
    return dataSource;
}

const setupWells = async (wells) => {
    const features = [...wells.values()].map(well => ({ type: "Feature", id: well.id, name: well.name, geometry: well.Geometry, properties: { id: well.id } }));
    const geoJson = { type: "FeatureCollection", features: features };
    let dataSource = await GeoJsonDataSource.load(geoJson);
    dataSource.name = "Well";
    var p = dataSource.entities.values;
    for (var i = 0; i < p.length; i++) {
        const entity = p[i];
        if (entity.billboard) {
            entity.billboard = undefined;
            entity.point = new PointGraphics({
                pixelSize: 4,
                color: Color.BLACK,
                distanceDisplayCondition: new DistanceDisplayCondition(0.0, 8500009.5),
                translucencyByDistance: new NearFarScalar(2300009.5, 1, 8500009.5, 0.01),
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
    let dataSource = await GeoJsonDataSource.load(geoJson);
    dataSource.name = "Wreck";
    var p = dataSource.entities.values;
    for (var i = 0; i < p.length; i++) {
        const entity = p[i];
        if (entity.billboard) {
            entity.billboard = undefined;
            entity.point = new PointGraphics({
                pixelSize: 4,
                color: Color.SLATEGREY,
                distanceDisplayCondition: new DistanceDisplayCondition(0.0, 8500009.5),
                translucencyByDistance: new NearFarScalar(2300009.5, 1, 8500009.5, 0.01),
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
    let scale = new NearFarScalar(1.5e2, 1.5, 8.0e6, 0.0);
    const features = [...areas.values()].map(area => ({ type: "Feature", id: area.id, name: area.name, geometry: area.Geometry, properties: { id: area.id } }));
    const geoJson = { type: "FeatureCollection", features: features };
    let dataSource = await GeoJsonDataSource.load(geoJson);
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
                    const colour = Color.fromCssColorString(rawEntity.Colour);
                    polygon.material = colour.withAlpha(0.4);
                    polygon.outlineColor = colour;

                } catch (e) {
                }

            }
            var center = BoundingSphere.fromPoints(entity.polygon.hierarchy.getValue().positions).center;
            Ellipsoid.WGS84.scaleToGeodeticSurface(center, center);
            entity.position = new ConstantPositionProperty(center);
        }
        entity.label = new LabelGraphics({
            text: entity.name,
            distanceDisplayCondition: new DistanceDisplayCondition(0.0, 400000),
            font: '20px Arial Narrow"',
            scaleByDistance: scale,
            fillColor: Color.BLACK,
            style: LabelStyle.FILL,
            outlineColor: Color.WHITE,
            outlineWidth: 1.5,
            pixelOffset: new Cartesian2(25, 0),
            verticalOrigin: VerticalOrigin.CENTER,
            horizontalOrigin: HorizontalOrigin.LEFT,
            heightReference: dynamicHeightReference,
            scale: 0.65,
            zIndex: 60

        });
    }
    return dataSource;
}

const setupBasins = async (basins) => {
    let scale = new NearFarScalar(1.5e2, 1.5, 8.0e6, 0.0);
    const features = [...basins.values()].map(basin => ({ type: "Feature", id: basin.id, name: basin.name, geometry: basin.Geometry, properties: { id: basin.id } }));
    const geoJson = { type: "FeatureCollection", features: features };
    let dataSource = await GeoJsonDataSource.load(geoJson);
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
                    const colour = Color.fromCssColorString(rawEntity.Colour);
                    polygon.material = colour.withAlpha(0.6);
                    polygon.outlineColor = colour;
                } catch (e) {
                }
            }
            var center = BoundingSphere.fromPoints(entity.polygon.hierarchy.getValue().positions).center;
            Ellipsoid.WGS84.scaleToGeodeticSurface(center, center);
            entity.position = new ConstantPositionProperty(center);
        }

        entity.label = new LabelGraphics({
            text: entity.name,
            distanceDisplayCondition: new DistanceDisplayCondition(0.0, 400000),
            font: '20px Arial Narrow"',
            scaleByDistance: scale,
            fillColor: Color.BLACK,
            style: LabelStyle.FILL,
            outlineColor: Color.WHITE,
            outlineWidth: 1.5,
            pixelOffset: new Cartesian2(25, 0),
            verticalOrigin: VerticalOrigin.CENTER,
            horizontalOrigin: HorizontalOrigin.LEFT,
            heightReference: dynamicHeightReference,
            scale: 0.65,
            zIndex: 60
        });
    }
    return dataSource;
}

const leftClick = (viewer, distance, history, location, search, dispatch, e) => {
    var position = viewer.camera.pickEllipsoid(e.position);
    var cartographicPosition = Ellipsoid.WGS84.cartesianToCartographic(position);
    var y = cartographicPosition.latitude;
    var x = cartographicPosition.longitude;
    let pos = Cartesian3.fromRadians(x, y)
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
}

const CesiumMap = () => {
    const [{ decomYards, subsurfaces, wells, wrecks, areas, basins, onshoreGasPipes, onshoreGasSites, onshoreGridCables, onshorePowerlines, onshoreWindfarms, workingGroups,
        showDecomYards, showSubsurfaces, showBlocks, showWells, showWrecks, showAreas, showBasins, showOnshoreGasPipes, showOnshoreGasSites, showOnshorePowerlines, showOnshoreGridCables, showOnshoreWindfarms, showWorkingGroups, year,
        subsurfacesVisible, wellsVisible, decomnYardsVisible, wrecksVisible, areasVisible, basinsVisible, onshoreWindfarmsVisibile, onshoreGasPipesVisible, onshoreGasSitesVisible, onshoreGridCablesVisible, onshorePowerlinesVisibile, workingGroupsVisible,
        mapStyle, enableTerrain, globe3D, radius, radiusEnabled }, dispatch] = useStateValue();
    const cesiumRef = useRef(null);
    const viewer = useMemo(() => setupCesium(cesiumRef), [cesiumRef]);
    const location = useLocation();
    const history = useHistory();
    const searchParams = new URLSearchParams(location.search);
    const eid = searchParams.get("eid");
    const etype = searchParams.get("etype");
    const [hover, setHover] = useState(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const installationsDataSource = useInstallations({ requestRender: viewer.scene.requestRender });
    const pipelinesDataSource = usePipelines({ requestRender: viewer.scene.requestRender });
    const ccpipelinesDataSource = useCCPiplines({ requestRender: viewer.scene.requestRender });
    const fieldsDataSource = useFields({ requestRender: viewer.scene.requestRender });
    const ccfieldsDataSource = useCCFields({ requestRender: viewer.scene.requestRender });
    const windfarmsDataSource = useWindfarms({ requestRender: viewer.scene.requestRender });

    useEffect(() => {
        if (!viewer) return;
        switchStyle(viewer, mapStyle);
    }, [viewer, mapStyle]);

    useEffect(() => {
        if (!viewer) return;
        const radius = viewer.entities.getById("SOI");
        if (radius) {
            radius.show = radiusEnabled;
        }
    }, [viewer, radiusEnabled]);

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
                if (etype) {
                    const dataSources = viewer.dataSources.getByName(etype);
                    if (dataSources.length !== 0) {
                        const entity = dataSources[0].entities.getById(eid);
                        if (entity) {
                            viewer.flyTo(entity, {
                                offset: new HeadingPitchRange(0, -CesiumMath.PI_OVER_FOUR, 50000)
                            });
                        }
                    }
                }
                break;
            }
        }

    }, [viewer, areas, eid, etype]);


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
        if (!viewer || !workingGroupsVisible) return;
        toggleEntityVisibility(viewer, "WorkingGroup", workingGroupsVisible);
    }, [viewer, workingGroupsVisible]);
    useEffect(() => {
        if (!viewer || !basinsVisible) return;
        toggleEntityVisibility(viewer, "Basin", basinsVisible);
    }, [viewer, basinsVisible]);

    useEffect(() => {
        if (!viewer || !onshoreGasPipesVisible) return;
        toggleEntityVisibility(viewer, "OnshoreGasPipe", onshoreGasPipesVisible);
    }, [viewer, onshoreGasPipesVisible]);

    useEffect(() => {
        if (!viewer || !onshoreGasSitesVisible) return;
        toggleEntityVisibility(viewer, "OnshoreGasSite", onshoreGasSitesVisible);
    }, [viewer, onshoreGasSitesVisible]);

    useEffect(() => {
        if (!viewer || !onshoreGridCablesVisible) return;
        toggleEntityVisibility(viewer, "OnshoreGridCable", onshoreGridCablesVisible);
    }, [viewer, onshoreGridCablesVisible]);

    useEffect(() => {
        if (!viewer || !onshoreWindfarmsVisibile) return;
        toggleEntityVisibility(viewer, "OnshoreWindfarm", onshoreWindfarmsVisibile);
    }, [viewer, onshoreWindfarmsVisibile]);

    useEffect(() => {
        if (!viewer || !onshorePowerlinesVisibile) return;
        toggleEntityVisibility(viewer, "OnshorePowerline", onshorePowerlinesVisibile);
    }, [viewer, onshorePowerlinesVisibile]);

    useEffect(() => {
        if (!viewer) return;
        const decomYards = viewer.dataSources.getByName("DecomYard");
        if (decomYards.length > 0) decomYards[0].show = showDecomYards;
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
        const onshoreGasPipes = viewer.dataSources.getByName("OnshoreGasPipe");
        if (onshoreGasPipes.length > 0) onshoreGasPipes[0].show = showOnshoreGasPipes;
        const onshoreGasSites = viewer.dataSources.getByName("OnshoreGasSite");
        if (onshoreGasSites.length > 0) onshoreGasSites[0].show = showOnshoreGasSites;
        const onshoreGridCables = viewer.dataSources.getByName("OnshoreGridCable");
        if (onshoreGridCables.length > 0) onshoreGridCables[0].show = showOnshoreGridCables;
        const onshorePowerlines = viewer.dataSources.getByName("OnshorePowerline");
        if (onshorePowerlines.length > 0) onshorePowerlines[0].show = showOnshorePowerlines;
        const onshoreWindfarms = viewer.dataSources.getByName("OnshoreWindfarm");
        if (onshoreWindfarms.length > 0) onshoreWindfarms[0].show = showOnshoreWindfarms;
        const workingGroups = viewer.dataSources.getByName("WorkingGroup");
        if (workingGroups.length > 0) workingGroups[0].show = showWorkingGroups;
        viewer.scene.requestRender();
    }, [viewer, showDecomYards, showBlocks, showSubsurfaces, showWells, showWrecks, showAreas, showBasins, showOnshoreGasPipes, showOnshoreGasSites, showOnshoreGridCables, showOnshorePowerlines, showOnshoreWindfarms, showWorkingGroups]);

    useEffect(() => {
        if (viewer) {
            viewer.clockViewModel.currentTime = new JulianDate.fromIso8601("" + year);
        }
    }, [viewer, year]);

    useEffect(() => {
        if (!viewer) return;
        if (enableTerrain) {
            viewer.terrainProvider = terrainProvider;
            heightReference = HeightReference.CLAMP_TO_GROUND;
        } else {
            viewer.terrainProvider = defaultTerrainProvider;
            heightReference = HeightReference.NONE;
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
        viewer.dataSources.add(installationsDataSource);
        viewer.dataSources.add(pipelinesDataSource);
        viewer.dataSources.add(fieldsDataSource);
        viewer.dataSources.add(ccpipelinesDataSource);
        viewer.dataSources.add(ccfieldsDataSource);
        viewer.dataSources.add(windfarmsDataSource);
        
        setupRadius(viewer);
        flyHome(viewer);
        setupBlocks().then(dataSource => { dataSource.show = showBlocks; dataSource.name = "Block"; viewer.dataSources.add(dataSource) });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!viewer) return;
        viewer.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.LEFT_CLICK);
        viewer.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.MOUSE_MOVE);
        viewer.screenSpaceEventHandler.setInputAction((e) => leftClick(viewer, radius, history, location, new URLSearchParams(location.search), dispatch, e), ScreenSpaceEventType.LEFT_CLICK);
        viewer.screenSpaceEventHandler.setInputAction((e) => mouseMove(viewer, setHover, e), ScreenSpaceEventType.MOUSE_MOVE);
    }, [viewer, history, location, radius, dispatch]);

    useEffect(() => {
        if (viewer) {
            changeRadiusSize(viewer, radius);
            findEntitiesInRange(viewer, radius, dispatch)
        }
    }, [viewer, radius, dispatch]);

    useEffect(() => {
        if (!viewer || decomYards.size === 0) return;
        const dataSource = setupDecomyards(decomYards);
        dataSource.show = showDecomYards;
        viewer.dataSources.add(dataSource);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewer, decomYards]);

    useEffect(() => {
        if (!viewer || workingGroups.size === 0) return;
        async function load() {
            const dataSource = await setupWorkingGroups(workingGroups);
            dataSource.show = showWorkingGroups;
            viewer.dataSources.add(dataSource);
        }
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewer, workingGroups]);

    useEffect(() => {
        if (!viewer || onshoreGasPipes.size === 0) return;
        async function load() {
            const dataSource = await setupOnshoreGasPipes(onshoreGasPipes);
            dataSource.show = showOnshoreGasPipes;
            viewer.dataSources.add(dataSource);
        }
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewer, onshoreGasPipes]);

    useEffect(() => {
        if (!viewer || onshoreGasSites.size === 0) return;
        async function load() {
            const dataSource = await setupOnshoreGasSites(onshoreGasSites);
            dataSource.show = showOnshoreGasSites;
            viewer.dataSources.add(dataSource);
        }
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewer, onshoreGasSites]);

    useEffect(() => {
        if (!viewer || onshoreGridCables.size === 0) return;
        async function load() {
            const dataSource = await setupOnshoreGridCables(onshoreGridCables);
            dataSource.show = showOnshoreGridCables;
            viewer.dataSources.add(dataSource);
        }
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewer, onshoreGridCables]);

    useEffect(() => {
        if (!viewer || onshorePowerlines.size === 0) return;
        async function load() {
            const dataSource = await setupOnshorePowerlines(onshorePowerlines);
            dataSource.show = showOnshorePowerlines;
            viewer.dataSources.add(dataSource);
        }
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewer, onshorePowerlines]);

    useEffect(() => {
        if (!viewer || onshoreWindfarms.size === 0) return;
        async function load() {
            const dataSource = await setupOnshoreWind(onshoreWindfarms);
            dataSource.show = showOnshoreWindfarms;
            viewer.dataSources.add(dataSource);
        }
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewer, onshoreWindfarms]);

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

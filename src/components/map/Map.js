import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import './Map.scss';
import { useStateValue } from '../../utils/state';
import HoverCard from './HoverCard';
import { Color, CesiumTerrainProvider, EllipsoidTerrainProvider, UrlTemplateImageryProvider, Credit, Viewer, SceneMode, MapboxImageryProvider, Rectangle, Cartographic, EllipsoidGeodesic, JulianDate, Cartesian3, Ellipsoid, HeadingPitchRange, ScreenSpaceEventType, Math as CesiumMath } from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";
import { useInstallations } from './Installations';
import { usePipelines } from './Pipelines';
import { useFields } from './Fields';
import { useCCPipelines } from './CarbonCapturePipelines';
import { useCCFields } from './CarbonCaptureFields';
import { useCCSites } from './CarbonCaptureSites';
import { useWindfarms } from './Windfarms';
import { useAreas } from './Areas';
import { useBasins } from './Basins';
import { useSubsurfaces } from './Subsurfaces';
import { useWells } from './Wells';
import { useWorkingGroups } from './WorkingGroups';
import { useWrecks } from './Wrecks';
import { useOnshoreGasPipes } from './OnshoreGasPipes';
import { useOnshoreGasSites } from './OnshoreGasSites';
import { useOnshoreWindfarms } from './OnshoreWindfarms';
import { useOnshoreGridCables } from './OnshoreGridCables';
import { useOnshorePowerlines } from './OnshorePowerlines';
import { useBlocks } from './Blocks';
const bathymetryBaseUrl = process.env.NODE_ENV === 'development' ? 'https://tiles.emodnet-bathymetry.eu/v9/terrain' : 'https://emodnet-terrain.azureedge.net/v9/terrain';

const terrainProvider = new CesiumTerrainProvider({
    url: bathymetryBaseUrl,
    credit: "EMODnet Bathymetry Consortium (2018): EMODnet Digital Bathymetry (DTM)"
});

const defaultTerrainProvider = new EllipsoidTerrainProvider();

async function setupCesium(cesiumRef, dataSources) {

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

    setupRadius(viewer);
    flyHome(viewer);

    for (const ds of dataSources) {
        await viewer.dataSources.add(ds);
    }

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

function distanceFromEntity(entityPosition, position) {
    const startCartographicPoint = Cartographic.fromCartesian(entityPosition);
    const endCartographicPoint = Cartographic.fromCartesian(position);
    const ellipsoidGeodesic = new EllipsoidGeodesic(startCartographicPoint, endCartographicPoint);
    const distance = ellipsoidGeodesic.surfaceDistance;
    return Math.abs(distance);
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
                    if (!entity.originalData) return;
                    let distance;
                    if (entity.polyline?.positions) {
                        const positions = entity.polyline.positions.getValue(time);
                        const first = positions[0];
                        const distanceFromFirst = distanceFromEntity(first, position);

                        if (positions.length > 1) {
                            const last = positions[positions.length - 1];
                            const distanceFromLast = distanceFromEntity(last, position);
                            distance = Math.min(distanceFromFirst, distanceFromLast);
                        } else {
                            distance = distanceFromFirst;
                        }
                    } else 
                    if (entity.position) {
                        distance = distanceFromEntity(entity.position.getValue(time), position);
                    }
                    if (distance <= radiusDistance) {
                        const entityToAdd = { entity: entity.originalData, distance: distance, type: dataSource.name };
                        withIn.push(entityToAdd);
                    }
                });
            }

            dispatch({ type: "setWithIn", withIn: groupBy(withIn, "type") });
        }
    }
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
    const [{ year, mapStyle, enableTerrain, globe3D, radius, radiusEnabled }, dispatch] = useStateValue();
    const cesiumRef = useRef(null);
    const [viewer, setViewer] = useState(null);
    const requestRender = useCallback(() => {
        if (viewer?.scene) {
            viewer.scene.requestRender();
        }
    }, [viewer]);
    const installationsDataSource = useInstallations({ requestRender: requestRender });
    const pipelinesDataSource = usePipelines({ requestRender: requestRender });
    const ccpipelinesDataSource = useCCPipelines({ requestRender: requestRender });
    const fieldsDataSource = useFields({ requestRender: requestRender });
    const ccfieldsDataSource = useCCFields({ requestRender: requestRender });
    const ccsitesDataSource = useCCSites({ requestRender: requestRender });
    const windfarmsDataSource = useWindfarms({ requestRender: requestRender });
    const areasDataSource = useAreas({ requestRender: requestRender });
    const basinsDataSource = useBasins({ requestRender: requestRender });
    const subsurfacesDataSource = useSubsurfaces({ requestRender: requestRender });
    const wellsDataSource = useWells({ requestRender: requestRender });
    const workingGroupsDataSource = useWorkingGroups({ requestRender: requestRender });
    const wrecksDataSource = useWrecks({ requestRender: requestRender });
    const onshoreGasPipesDataSource = useOnshoreGasPipes({ requestRender: requestRender });
    const onshoreGasSitesDataSource = useOnshoreGasSites({ requestRender: requestRender });
    const onshoreWindfarmsDataSource = useOnshoreWindfarms({ requestRender: requestRender });
    const onshoreGridCablesDataSource = useOnshoreGridCables({ requestRender: requestRender });
    const onshorePowerlinesDataSource = useOnshorePowerlines({ requestRender: requestRender });
    const blocks = useBlocks({ requestRender: requestRender });
    const dataSources = useMemo(() => {
        return [
            installationsDataSource,
            pipelinesDataSource,
            ccpipelinesDataSource,
            fieldsDataSource,
            ccfieldsDataSource,
            ccsitesDataSource,
            windfarmsDataSource,
            areasDataSource,
            basinsDataSource,
            subsurfacesDataSource,
            wellsDataSource,
            workingGroupsDataSource,
            wrecksDataSource,
            onshoreGasPipesDataSource,
            onshoreGasSitesDataSource,
            onshoreWindfarmsDataSource,
            onshoreGridCablesDataSource,
            onshorePowerlinesDataSource,
            blocks
        ];
    }, []);
    useEffect(() => {
        async function setup() {
            if (cesiumRef.current) {
                const viewer = await setupCesium(cesiumRef, dataSources);
                setViewer(viewer);
            }
        }
        setup()
    }, [cesiumRef, dataSources]);

    const location = useLocation();
    const history = useHistory();
    const searchParams = new URLSearchParams(location.search);
    const eid = searchParams.get("eid");
    const etype = searchParams.get("etype");
    const [hover, setHover] = useState(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });


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

    }, [viewer, eid, etype]);

    useEffect(() => {
        if (viewer) {
            viewer.clockViewModel.currentTime = new JulianDate.fromIso8601("" + year);
        }
    }, [viewer, year]);

    useEffect(() => {
        if (!viewer) return;
        if (enableTerrain) {
            viewer.terrainProvider = terrainProvider;
        } else {
            viewer.terrainProvider = defaultTerrainProvider;
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



    return (
        <div onMouseMove={(e => { if (hover) { setPosition({ x: e.nativeEvent.offsetX + 5, y: e.nativeEvent.offsetY + 5 }) } })}>
            {hover && <HoverCard position={position} type={hover.type} entity={hover.entity} />}
            <div id="cesiumContainer" ref={cesiumRef} />
        </div >
    );
}

export default CesiumMap;

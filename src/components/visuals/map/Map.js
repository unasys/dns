import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import './Map.scss';
import { changeCurrentInstallation } from '../../../actions/installationActions';
import axios from 'axios';
import ReactCursorPosition from 'react-cursor-position';
import InstallationHoverCard from './InstallationHoverCard';
import DecomyardHoverCard from './DecomyardHoverCard';
import WindfarmHoverCard from './WindfarmHoverCard';
import PipelineHoverCard from './PipelineHoverCard';
import FieldHoverCard from './FieldHoverCard';

const bathymetryBaseUrl = process.env.NODE_ENV === 'development' ? 'https://tiles.emodnet-bathymetry.eu/v9/terrain' : 'https://emodnet-terrain.azureedge.net/v9/terrain';
const assetsBaseUrl = process.env.NODE_ENV === 'development' ? 'https://digitalnorthsea.blob.core.windows.net' : 'https://assets.digitalnorthsea.com';
const ukBlocks = assetsBaseUrl + "/data/uk_blocks.json";

let iconModels = {
    "FPSO": assetsBaseUrl + "/models/platform-types/FPSO/lp_fpsoplat.gltf",
    "FPU": assetsBaseUrl + "/models/platform-types/FPU/fpu_lowpoly.gltf",
    "FPV": assetsBaseUrl + "/models/platform-types/FPV/lp_fpsoplat.gltf",
    "GravBase": assetsBaseUrl + "/models/platform-types/GravBase/lp_gravbase.gltf",
    "Jacket": assetsBaseUrl + "/models/platform-types/Jacket/lp_jacket.gltf",
    "Platform": assetsBaseUrl + "/models/platform-types/Jacket/lp_jacket.gltf",
    "FSO": assetsBaseUrl + "/models/platform-types/FPU/fpu_lowpoly.gltf"
};

let pipelineColours = {
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

let fieldColours = {
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
const CancelToken = axios.CancelToken;

class Map extends Component {
    constructor(props) {
        super(props)
        this.mouseEvent = this.mouseEvent.bind(this);
        this.setMousePosition = this.setMousePosition.bind(this);
        this.getMousePosition = this.getMousePosition.bind(this);
        this.getHandlerNull = this.getHandlerNull.bind(this);
        this.setHandlerNull = this.setHandlerNull.bind(this);
        this.setCurrentPath = this.setCurrentPath.bind(this);
        this.getCurrentPath = this.getCurrentPath.bind(this);
        this.addCurrentLabel = this.addCurrentLabel.bind(this);
        this.getCurrentLabels = this.getCurrentLabels.bind(this);
        this.setCurrentLabels = this.setCurrentLabels.bind(this);
        this.getDynamicLengthlabel = this.getDynamicLengthlabel.bind(this);
        this.setDynamicLengthLabel = this.setDynamicLengthLabel.bind(this);
        this.updatePosition = this.updatePosition.bind(this);
        this.flyTo = this.flyTo.bind(this);
        this.source = CancelToken.source();
        this.state = {
            viewer: null,
            isHidden: false,
            positions: [],
            installations: [],
            decomyards: [],
            pipelines: [],
            fields: [],
            windfarms: [],
            ukBlocks:null,
            currentInstallationFilter: null,
            currentDecomYardFilter: null,
            currentPipelineFilter: null,
            currentFieldFilter: null,
            currentWindfarmFilter: null,
            lastHoveredInstallation: null,
            lastHoveredDecomyard: null,
            lastHoveredWindfarm: null,
            lastHoveredPipeline: null,
            lastHoveredField: null,
        }

        this.quadrants = null;

        this.state.installations = this.props.cesiumInstallations;
        if (this.props.cesiumDecomyards) {
            this.state.decomyards = this.props.cesiumDecomyards;
        }
        if (this.props.cesiumPipelines) {
            this.state.pipelines = this.props.cesiumPipelines;
        }
    }

    updatePositions(positions) {
        this.setState({
            positions: positions
        })
        this.props.updatePositions(positions);
    }

    scaleBetween(unscaledNum, minAllowed, maxAllowed, min, max) {
        return (maxAllowed - minAllowed) * (unscaledNum - min) / (max - min) + minAllowed;
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.location.pathname !== this.props.location.pathname) {
            return true;
        }
        // toggle quadrants 
        if (this.props.showQuadrants != nextProps.showQuadrants) {
            let index = this.state.viewer.dataSources.indexOf(this.quadrants)
            let dataSource = this.state.viewer.dataSources.get(index);
            if (nextProps.showQuadrants) {
                if (index === -1) {
                    this.addQuadrantsToMap(this.state.viewer);
                } else {
                    dataSource.entities.show = true;                
                }
            } else {
                dataSource.entities.show = false;
            }
            this.state.viewer.scene.requestRender()
        }
        // toggle quadrants

        // toggle pipelines 
        if (this.props.showPipelines != nextProps.showPipelines) {
            if (!this.pipelinePoints) {
                this.loadUpPipelines(nextProps);
            } else {
                this.pipelinePoints.map(pipeline => {
                    pipeline.show = nextProps.showPipelines
                })
            }   
            this.state.viewer.scene.requestRender()

        }
        // toggle pipelines

        // toggle fields 
        if (this.props.showFields != nextProps.showFields) {
            if (!this.fieldPoints) {
                this.loadUpFields(nextProps);
            } else {
                this.fieldPoints.map(field => {
                    field.show = nextProps.showFields
                })
            }   
            this.state.viewer.scene.requestRender()
        }
        // toggle fields

        if (this.state.lastHoveredInstallation !== nextState.lastHoveredInstallation) {
            return true;
        }
        if (this.state.lastHoveredDecomyard !== nextState.lastHoveredDecomyard) {
            return true;
        }
        if (this.state.lastHoveredWindfarm !== nextState.lastHoveredWindfarm) {
            return true;
        }
        if (this.state.lastHoveredPipeline !== nextState.lastHoveredPipeline) {
            return true;
        }
        if (this.state.lastHoveredField !== nextState.lastHoveredField) {
            return true;
        }

        if (this.state.viewer != null) {
            //first run    
            if (this.props.cesiumDecomyards.length === 0 && nextProps.cesiumDecomyards !== 0) {
                this.decomyardsPoints = this.loadUpDecomyards(nextProps);
            }
            if (this.props.cesiumInstallations.length === 0 && nextProps.cesiumInstallations !== 0) {
                this.installationPoints = this.loadUpInstallations(nextProps);
            }
            if (this.props.cesiumWindfarms.length === 0 && nextProps.cesiumWindfarms !== 0) {
                this.windfarmPoints = this.loadUpWindfarms(nextProps);
            }
            // if (this.props.cesiumFields.length === 0 && nextProps.cesiumFields !== 0) {
            //     this.fieldPoints = this.loadUpFields(nextProps);
            // }
            // if (this.props.cesiumPipelines.length === 0 && nextProps.cesiumPipelines !== 0) {
            //     this.pipelinePoints = this.loadUpPipelines(nextProps);
            // }

            // handle update.
            if (this.props.cesiumDecomyards.length !== nextProps.cesiumDecomyards.length) {
                this.clearDecomYards();
                this.loadUpDecomyards(nextProps);
            }
            if (this.props.cesiumInstallations.length !== nextProps.cesiumInstallations.length) {
                this.clearInstallations();
                this.loadUpInstallations(nextProps);
            }
            if (this.props.cesiumWindfarms.length !== nextProps.cesiumWindfarms.length) {
                this.clearWindfarms();
                this.loadUpWindfarms(nextProps);
            }
            if (this.props.cesiumFields.length !== nextProps.cesiumFields.length && this.props.showFields) {
                this.clearFields();
                this.loadUpFields(nextProps);
            }
            if (this.props.cesiumPipelines.length !== nextProps.cesiumPipelines.length && this.props.showPipelines) {
                this.clearPipelines();
                this.loadUpPipelines(nextProps);
            }

            if (this.props.decomYardFilter !== nextProps.decomYardFilter) {
                this.filterDecomYards(nextProps.decomYardFilter);
                return true;
            }

            if (this.props.pipelineFilter !== nextProps.pipelineFilter) {
                this.filterPipelines(nextProps.pipelineFilter);
                return true;
            }

            if (this.props.activeTab !== nextProps.activeTab || this.state.installations !== nextState.installations) {
                return true;
            }

            if (this.props.currentInstallation !== nextProps.currentInstallation) {
                if (nextProps.currentInstallation && nextProps.currentInstallation.CesiumId) {
                    this.loadCesiumModelOntoMap(nextProps.currentInstallation.CesiumId)
                }
                return true;
            }

            if (this.props.year !== nextProps.year) {
                this.state.viewer.clockViewModel.currentTime = new window.Cesium.JulianDate.fromIso8601(""+nextProps.year);
            }
        }
        return false;
    }

    addQuadrantsToMap(viewer) { 
        let scale = new window.Cesium.NearFarScalar(1.5e2, 1.5, 8.0e6, 0.0);
        window.Cesium.GeoJsonDataSource.load(ukBlocks,{
            fill:window.Cesium.Color.TRANSPARENT,
            stroke:window.Cesium.Color.LIGHTCORAL
        }).then((dataSource) => {
                let self = this;
                viewer.dataSources.add(dataSource);
                var p = dataSource.entities.values;
                for (var i = 0; i < p.length; i++) {
                    let entity = p[i];
                    let polygon = entity.polygon;
                    if(polygon){
                        //var position = entity.polygon.hierarchy.getValue().positions[0];
                        var center = window.Cesium.BoundingSphere.fromPoints(entity.polygon.hierarchy.getValue().positions).center;
                        window.Cesium.Ellipsoid.WGS84.scaleToGeodeticSurface(center, center);
                        entity.position = new window.Cesium.ConstantPositionProperty(center);;
                    }
                    entity.label = new window.Cesium.LabelGraphics({
                        text:entity.properties.ALL_LABELS,
                        //pixeloffset : new window.Cesium.Cartesian2(50, 50),
                    //     verticalOrigin: window.Cesium.VerticalOrigin.TOP,
                    // horizontalOrigin: window.Cesium.HorizontalOrigin.LEFT,
                    distanceDisplayCondition: new window.Cesium.DistanceDisplayCondition(0.0, 400000),
                    font: '12px sans-serif',
                    scaleByDistance:scale
                    //heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND
                    });
                    self.quadrants = dataSource;
                }
            }
        ).otherwise(function(error) {
            console.error(error);
          });
    }

    initialiseViewer() {
        var terrainProvider = new window.Cesium.CesiumTerrainProvider({
            url: bathymetryBaseUrl,
            credit: "EMODnet Bathymetry Consortium (2018): EMODnet Digital Bathymetry (DTM)"
        });

        var mapbox = new window.Cesium.MapboxImageryProvider({
            mapId: 'mapbox.satellite',
            accessToken: 'pk.eyJ1IjoidW5hc3lzIiwiYSI6ImNqenR6MnBmMTA5dG4zbm80anEwdXVkaWUifQ.fzndysGAsyLbY8UyAMPMLQ'
        });

        this.terrainIsOn = true;
        //eslint-disable-next-line
        var viewer =
            new window.Cesium.Viewer('cesiumContainer', {
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
        viewer.camera.changed.addEventListener(
            function () {
                if (viewer.camera._suspendTerrainAdjustment && viewer.scene.mode === window.Cesium.SceneMode.SCENE3D) {
                    viewer.camera._suspendTerrainAdjustment = false;
                    viewer.camera._adjustHeightForTerrain();
                }
            }
        );

        viewer.scene.globe.enableLighting = false;
        viewer.scene.globe.depthTestAgainstTerrain = false;

        //eslint-disable-next-line
        this.state.viewer = viewer;
    }

    setMousePosition(p) {
        this.mousePosition = p;
    }

    getMousePosition() {
        return this.mousePosition;
    }

    setHandlerNull(isNull) {
        this.handlerNull = isNull;
    }

    getHandlerNull() {
        return this.handlerNull;
    }

    flyTo(west, south, east, north, pitch) {
        var rectangle = window.Cesium.Rectangle.fromDegrees(west, south, east, north);
        this.state.viewer.camera.flyTo({
            destination: rectangle,
            duration: 3,
            orientation: {
                heading: 0.0,
                pitch: window.Cesium.Math.toRadians(pitch),
                roll: 0.0
            }
        });
    }

    componentDidMount() {
        this.initialiseViewer();
        var west = -10.0;
        var south = 35.0;
        var east = 10.0;
        var north = 46.0;
        var rectangle = window.Cesium.Rectangle.fromDegrees(west, south, east, north);
        // fly to the north sea
        this.state.viewer.camera.flyTo({
            destination: rectangle,
            duration: 3,
            orientation: {
                heading: 0.0,
                pitch: window.Cesium.Math.toRadians(-50),
                roll: 0.0
            }
        });
        this.addHighlightHandlers();
    }

    componentWillUnmount() {
        this.source.cancel()
    }

    clearInstallations() {
        if (this.installationPoints !== undefined) {
            for (var i = 0; i < this.installationPoints.length; i++) {
                this.state.viewer.entities.remove(this.installationPoints[i]);
            }
        }
    }

    clearDecomYards() {
        if (this.decomyardsPoints !== undefined) {
            for (var i = 0; i < this.decomyardsPoints.length; i++) {
                this.state.viewer.entities.remove(this.decomyardsPoints[i]);
            }
        }
    }

    clearPipelines() {
        if (this.pipelinePoints !== undefined) {
            for (var i = 0; i < this.pipelinePoints.length; i++) {
                this.state.viewer.entities.remove(this.pipelinePoints[i]);
            }
        }
    }

    clearWindfarms() {
        if (this.windfarmPoints !== undefined) {
            for (var i = 0; i < this.windfarmPoints.length; i++) {
                this.state.viewer.entities.remove(this.windfarmPoints[i]);
            }
        }
    }

    clearFields() {
        if (this.fieldPoints !== undefined) {
            for (var i = 0; i < this.fieldPoints.length; i++) {
                this.state.viewer.entities.remove(this.fieldPoints[i]);
            }
        }
    }

    setCurrentPath(path) {
        this.currentPath = path;
    }

    getCurrentPath() {
        return this.currentPath;
    }

    addCurrentLabel(label) {
        this.currentLabels.push(label);
    }

    getCurrentLabels() {
        return this.currentLabels;
    }

    setCurrentLabels(labels) {
        this.currentLabels = labels;
    }

    getDynamicLengthlabel() {
        return this.dynamicLengthLabel;
    }

    setDynamicLengthLabel(dll) {
        this.dynamicLengthLabel = dll;
    }

    updatePosition(position) {
        this.position = position;
        this.updatePositions(position);
    }

    addHighlightHandlers() {
        var handler = new window.Cesium.ScreenSpaceEventHandler(this.state.viewer.scene.canvas);

        var previousPickedEntity = undefined;

        const viewer = this.state.viewer;
        let self = this;
        // If the mouse is over a point of interest, change the entity billboard scale and color
        handler.setInputAction(function (movement) {
            var pickedPrimitive = viewer.scene.pick(movement.endPosition);
            var pickedEntity = (window.Cesium.defined(pickedPrimitive)) ? pickedPrimitive.id : undefined;

            // Unhighlight the previously picked entity
            if (window.Cesium.defined(previousPickedEntity)) {
                let color;
                if (previousPickedEntity.installation) {
                    color = previousPickedEntity.installation.Status === "Removed" ? window.Cesium.Color.fromCssColorString("#595436") : window.Cesium.Color.GOLD;
                } else if (previousPickedEntity.decomyard) {
                    color = window.Cesium.Color.AQUA;
                } else {
                    color = window.Cesium.Color.WHITE;
                }
                previousPickedEntity.point.color = color;
            }
            if (self.state.lastHoveredInstallation || self.state.lastHoveredDecomyard || self.state.lastHoveredWindfarm || self.state.lastHoveredPipeline|| self.state.lastHoveredField) {
                self.setState({
                    lastHoveredInstallation: null,
                    lastHoveredDecomyard: null,
                    lastHoveredWindfarm: null,
                    lastHoveredPipeline: null,
                    lastHoveredField : null
                })
            }

            // Highlight the currently picked entity
            if (window.Cesium.defined(pickedEntity) && window.Cesium.defined(pickedEntity.point)) {
                viewer.scene.requestRender();
                pickedEntity.point.color = window.Cesium.Color.AZURE;
                previousPickedEntity = pickedEntity;
                self.setState({
                    lastHoveredInstallation: pickedEntity.installation
                })
                self.setState({
                    lastHoveredDecomyard: pickedEntity.decomyard
                })
                self.setState({
                    lastHoveredWindfarm: pickedEntity.windfarm
                })
            } else if (window.Cesium.defined(pickedEntity) && window.Cesium.defined(pickedEntity.pipeline)) {
                self.setState({
                    lastHoveredPipeline: pickedEntity.pipeline
                })
            } else if (window.Cesium.defined(pickedEntity) && window.Cesium.defined(pickedEntity.field)) {
                self.setState({
                    lastHoveredField: pickedEntity.field
                })
            }
        }, window.Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }

    mouseEvent(e) {
        const picked = this.state.viewer.scene.pick(e.position);
        const id = picked ? picked.id || picked.primitive.id : null;
        if (picked && id) {
            if (id.installation !== undefined) {

                if (this.props.currentInstallation === id.installation) return; // if selecting already selected installation.
                // dot has been clicked.
                this.props.changeCurrentInstallation(id.installation);
            }
        }
    }

    loadUpInstallations(nextProps) {
        this.state.viewer.screenSpaceEventHandler.setInputAction(this.mouseEvent, window.Cesium.ScreenSpaceEventType.LEFT_CLICK);
        var installationPoints = [];
        let installations;

        if (nextProps.cesiumInstallations.length === 0) {
            installations = this.state.currentInstallationFilter ? this.state.currentInstallationFilter(this.state.installations) : this.state.installations;
        } else {
            installations = this.state.currentInstallationFilter ? this.state.currentInstallationFilter(nextProps.cesiumInstallations) : nextProps.cesiumInstallations;
        }

        for (var i = 0; i < installations.length; i++) {
            var installation = installations[i];
            if (installation.id === "world-map") { continue; }
            var model = iconModels[installation.Type];
            var start = installation.StartDate;
            var end = installation.PlannedCOP;
            
            if(start){
                start=window.Cesium.JulianDate.fromDate(new Date(start));
               
            }
            else{
                start=window.Cesium.JulianDate.fromDate(new Date("1901")); 
            }
           
            if(end){
               
                end = window.Cesium.JulianDate.fromDate(new Date(end));
            }
            else{
                end=window.Cesium.JulianDate.fromDate(new Date("2500")); 
            }
            
            var availability = null;
            if(start || end){
                var interval = new window.Cesium.TimeInterval({
                    start: start,
                    stop: end,
                    isStartIncluded : start !== null,
                    isStopIncluded : end !== null
                });
                availability = new window.Cesium.TimeIntervalCollection([interval]);
            }
            var point = this.state.viewer.entities.add({
                name: installation["Name"],
                position: window.Cesium.Cartesian3.fromDegrees(installation.Longitude, installation.Latitude),
                availability:availability,
                point: {
                    pixelSize: 6,
                    color: installation.Status === "Removed" ? window.Cesium.Color.fromCssColorString("#595436") : window.Cesium.Color.GOLD,
                    outlineColor: window.Cesium.Color.BLACK,
                    outlineWidth: 1,
                    eyeOffset: new window.Cesium.Cartesian3(0, 0, 1),
                    distanceDisplayCondition: new window.Cesium.DistanceDisplayCondition(0.0, 8500009.5),
                    translucencyByDistance: new window.Cesium.NearFarScalar(2300009.5, 1, 8500009.5, 0.01),
                    heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND
                },
                model: {
                    uri: model,
                    distanceDisplayCondition: new window.Cesium.DistanceDisplayCondition(0.0, 100000),
                    scale: 0.18,
                    heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND,
                    shadows: window.Cesium.ShadowMode.DISABLED
                },
                label: {
                    text: installation["Name"],
                    fillColor: window.Cesium.Color.WHITE,
                    style: window.Cesium.LabelStyle.FILL_AND_OUTLINE,
                    outlineColor: window.Cesium.Color.BLACK,
                    outlineWidth: 1.5,
                    pixelOffset: new window.Cesium.Cartesian2(25, 0),
                    verticalOrigin: window.Cesium.VerticalOrigin.CENTER,
                    horizontalOrigin: window.Cesium.HorizontalOrigin.LEFT,
                    distanceDisplayCondition: new window.Cesium.DistanceDisplayCondition(0.0, 700000),
                    heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND,
                    scale:0.5
                }
            });
            point.installation = installation;
            installationPoints.push(point);

        }
        this.installationPoints = installationPoints;
        return installationPoints;
    }

    loadUpDecomyards(nextProps) {
        var decomyardsPoints = [];
        let decomyards;

        if (nextProps.cesiumDecomyards.length === 0) {
            decomyards = this.state.currentDecomYardFilter ? this.state.currentDecomYardFilter(this.state.decomyards) : this.state.decomyards;
        } else {
            decomyards = this.state.currentDecomYardFilter ? this.state.currentDecomYardFilter(nextProps.cesiumDecomyards) : nextProps.cesiumDecomyards;
        }

        if (!decomyards) return;

        for (var i = 0; i < decomyards.length; i++) {
            var decomyard = decomyards[i];

            var point = this.state.viewer.entities.add({
                name: decomyard["Name"],
                position: window.Cesium.Cartesian3.fromDegrees(decomyard.Long, decomyard.Lat),
                point: {
                    pixelSize: 6,
                    color: window.Cesium.Color.AQUA,
                    eyeOffset: new window.Cesium.Cartesian3(0, 0, 1),
                    distanceDisplayCondition: new window.Cesium.DistanceDisplayCondition(0.0, 8500009.5),
                    translucencyByDistance: new window.Cesium.NearFarScalar(2300009.5, 1, 8500009.5, 0.01),
                    heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND,
                    outlineColor: window.Cesium.Color.BLACK,
                    outlineWidth: 1,
                },
                label: {
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
                }
            });
            point.decomyard = decomyard;
            decomyardsPoints.push(point);
        }
        this.decomyardsPoints = decomyardsPoints;
        return decomyardsPoints;
    }

    computeCircle(radius) {
        var positions = [];
        for (var i = 0; i < 360; i++) {
            var radians = window.Cesium.Math.toRadians(i);
            positions.push(new window.Cesium.Cartesian2(radius * Math.cos(radians), radius * Math.sin(radians)));
        }
        return positions;
    }

    getPipelineColour(pipeline) {
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

        var material = new window.Cesium.PolylineGlowMaterialProperty({
            color:colour,
            glowPower:0.2,
            taperPower:1.0
        })
        return material;
    }

    getFieldColour(field) {
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

    loadUpPipelines(nextProps) {
        let scale = new window.Cesium.NearFarScalar(1.5e2, 1.5, 8.0e6, 0.0);
        var pipelinePolys = [];
        let pipelines;

        if (!nextProps.cesiumPipelines || nextProps.cesiumPipelines.length === 0) {
            pipelines = this.state.currentPipelineFilter ? this.state.currentPipelineFilter(this.state.pipelines) : this.state.pipelines;
        } else {
            pipelines = this.state.currentPipelineFilter ? this.state.currentPipelineFilter(nextProps.cesiumPipelines) : nextProps.cesiumPipelines;
        }

        if (!pipelines) return;
        //var shape = this.computeCircle(40.0);
        var errors = [];
        var minDiameter = 0;
        var maxDiameter = 1058;
        this.state.viewer.entities.suspendEvents();
        for (var i = 0; i < pipelines.length; i++) {
            var pipeline = pipelines[i];
            var coordinates = pipeline.Coordinates;
            if (Array.isArray(coordinates) && coordinates.length > 0) {
                if (Array.isArray(coordinates[0])) {
                    try {
                        var c = coordinates;
                        if (coordinates[0].length > 0 && Array.isArray(coordinates[0][0])) {
                            c = coordinates.flat();
                        }
                        let flatCoordinates = c.flat();
                        var material = this.getPipelineColour(pipeline);

                        var pipeDiameter = parseInt(pipeline.Diameter) || 0

                        if (pipeline["Diameter Units"] === "inch") {
                            pipeDiameter = pipeDiameter * 25.4;
                        }
                        var scaledWidth = this.scaleBetween(pipeDiameter, 2, 4, minDiameter, maxDiameter);
                        var scaledDistance = this.scaleBetween(pipeDiameter, 150000, 50000000, minDiameter, maxDiameter);
                        var scaledTextDistance = this.scaleBetween(pipeDiameter, 20000, 100000, minDiameter, maxDiameter);
                        var label;
                        var a = Math.floor((flatCoordinates.length - 1) / 2);
                        var x = flatCoordinates[a];
                        var y = flatCoordinates[a + 1];
                        var position = window.Cesium.Cartesian3.fromDegrees(x, y);

                        label =
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
                                scaleByDistance:scale,
                                font: '14px sans-serif'
                            };

                        var start = pipeline["Start Date"];
                        if(start){
                            start=window.Cesium.JulianDate.fromDate(new Date(start));
                        }
                        else{
                            start=window.Cesium.JulianDate.fromDate(new Date("1901")); 
                        }
                        var end = pipeline["End Date"];
                        if(end){
                            end = window.Cesium.JulianDate.fromDate(new Date(end));
                        }
                        else{
                            end=window.Cesium.JulianDate.fromDate(new Date("2500")); 
                        }
                        
                        var availability = null;
                        if(start || end){
                            var interval = new window.Cesium.TimeInterval({
                                start: start,
                                stop: end,
                                isStartIncluded : start !== null,
                                isStopIncluded : end !== null
                            });
                            availability=new window.Cesium.TimeIntervalCollection([interval]);
                        }

                        var poly = this.state.viewer.entities.add({
                            name: pipeline["Pipeline Name"],
                            position: position,
                            availability:availability,
                            polyline: {
                                positions: window.Cesium.Cartesian3.fromDegreesArray(flatCoordinates),
                                material: material,
                                heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND,
                                width: scaledWidth,
                                distanceDisplayCondition: new window.Cesium.DistanceDisplayCondition(0, scaledDistance),
                            },
                            label: label
                        });
                        poly.pipeline = pipeline;
                        pipelinePolys.push(poly);
                    }
                    catch (error) {
                        errors.push({ error: error, coordinates: coordinates.flat() });
                    }
                }
            }


        }
        if (errors.length > 0) {
            console.error(errors);
        }
        this.state.viewer.entities.resumeEvents();

        this.pipelinePoints = pipelinePolys;
        return pipelinePolys;
    }

    loadUpWindfarms(nextProps) {
        var windfarmPoints = [];
        let windfarms;

        if (nextProps.cesiumWindfarms.length === 0) {
            windfarms = this.state.currentWindfarmFilter ? this.state.currentWindfarmFilter(this.state.windfarms) : this.state.windfarms;
        } else {
            windfarms = this.state.currentWindfarmFilter ? this.state.currentWindfarmFilter(nextProps.cesiumWindfarms) : nextProps.cesiumWindfarms;
        }

        if (!windfarms) return;

        for (var i = 0; i < windfarms.length; i++) {
            var windfarm = windfarms[i];

            if (!windfarm.LONGITUDE || !windfarm.LATITUDE) continue;

            var point = this.state.viewer.entities.add({
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
                }
            });
            point.windfarm = windfarm;
            windfarmPoints.push(point);
        }
        this.windfarmPoints = windfarmPoints;
        return windfarmPoints;
    }

    loadUpFields(nextProps) {
        var fieldPolys = [];
        let fields;

        if (nextProps.cesiumFields.length === 0) {
            fields = this.state.currentFieldFilter ? this.state.currentFieldFilter(this.state.fields) : this.state.fields;
        } else {
            fields = this.state.currentFieldFilter ? this.state.currentFieldFilter(nextProps.cesiumFields) : nextProps.cesiumFields;
        }

        if (!fields) return;

        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            if(field.Coordinates){
                var start = field["Discovery Date"];
               
                        if(start){
                            start=window.Cesium.JulianDate.fromDate(new Date(start));
                        }
                        else{
                            start=window.Cesium.JulianDate.fromDate(new Date("1901")); 
                        }
                        var end = 
                            end=window.Cesium.JulianDate.fromDate(new Date("2500")); 
                        
                        
                        var availability = null;
                        if(start || end){
                            var interval = new window.Cesium.TimeInterval({
                                start: start,
                                stop: end,
                                isStartIncluded : start !== null,
                                isStopIncluded : end !== null
                            });
                            availability=new window.Cesium.TimeIntervalCollection([interval]);
                        }
               
                var material = this.getFieldColour(field);
              //  var outline = material.brighten(0.5, new window.Cesium.Color());
                var flatCoordinates = field.Coordinates.flat();
                var poly = this.state.viewer.entities.add({
                    name: field["Field Name"],
                    //position: position,
                    availability : availability,
                    polygon: {
                        hierarchy : window.Cesium.Cartesian3.fromDegreesArray(flatCoordinates),
                        height:0,
                        material: material,
                       // outline : true,
                        //outlineColor : outline,
                        heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND,
                        //width: scaledWidth,
                        //distanceDisplayCondition: new window.Cesium.DistanceDisplayCondition(0, scaledDistance),
                    },
                    //label: label
                });
                poly.field = field;
                fieldPolys.push(poly);
            }
        }
        this.fieldPoints = fieldPolys;
        return fieldPolys;
    }

    

    render() {
        const divStyle = {
            width: '100%',
            height: '100%',
            zIndex: 1,
            pointerEvents: 'auto'
        };
        let hoveredInstallation = this.state.lastHoveredInstallation;
        let hoveredDecomyard = this.state.lastHoveredDecomyard;
        let hoveredWindfarm = this.state.lastHoveredWindfarm;
        let hoveredPipeline = this.state.lastHoveredPipeline;
        let hoveredField = this.state.lastHoveredField;

    
        return (
            <div style={{ height: '100%', width: '100%' }}>
                <ReactCursorPosition style={{ width: '100%', height: '100%', pointerEvents: 'none' }}>
                    <div id="cesiumContainer" style={divStyle} >
                    </div>
                    <InstallationHoverCard hoveredInstallation={hoveredInstallation}></InstallationHoverCard>
                    <DecomyardHoverCard hoveredDecomyard={hoveredDecomyard}></DecomyardHoverCard>
                    <WindfarmHoverCard hoveredWindfarm={hoveredWindfarm}> </WindfarmHoverCard>
                    <PipelineHoverCard hoveredPipeline={hoveredPipeline}></PipelineHoverCard>
                    <FieldHoverCard hoveredField={hoveredField}></FieldHoverCard>
                </ReactCursorPosition>
                <MapContext.Provider value={{flyTo: this.flyTo}}>{this.props.children}</MapContext.Provider>
            </div>
        );
    }
}

export const MapContext = React.createContext();

function mapDispatchToProps(dispatch) {
    return {
        changeCurrentInstallation: (currentInstallation) => {
            dispatch(changeCurrentInstallation(currentInstallation))
        }
    }
}

const mapStateToProps = (state) => {
    let filterType = state.InstallationReducer.installationFilter
    let decomYardFilterType = state.InstallationReducer.decomYardFilterType
    let pipelineFilterType = state.InstallationReducer.pipelineFilterType
    let windfarmFilterType = state.InstallationReducer.windfarmFilterType
    let fieldFilterType = state.InstallationReducer.fieldFilterType
    let year = state.MapReducer.year;
    return {
        currentInstallation: state.InstallationReducer.currentInstallation,
        cesiumInstallations: state.InstallationReducer.cesiumInstallations,
        cesiumDecomyards: state.InstallationReducer.cesiumDecomyards,
        cesiumPipelines: state.InstallationReducer.cesiumPipelines,
        cesiumFields: state.InstallationReducer.cesiumFields,
        showQuadrants: state.BathymetryReducer.ogaQuadrantsSwitched,
        showPipelines: state.BathymetryReducer.ogaPipelinesSwitched,
        showFields: state.BathymetryReducer.ogaFieldsSwitched,
        installationFilter: filterType,
        decomYardFilter: decomYardFilterType,
        pipelineFilterType: pipelineFilterType,
        cesiumWindfarms: state.InstallationReducer.cesiumWindfarms,
        windfarmFilter: windfarmFilterType,
        fieldFilter: fieldFilterType,
        year:year
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Map));

import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Map.scss';
import { changeCurrentInstallation } from '../../../actions/installationActions';
import history from '../../../history';
import { updatePositions } from '../../../actions/bathymetryActions';
import axios from 'axios';
import ReactCursorPosition from 'react-cursor-position';
import InstallationHoverCard from './InstallationHoverCard';
import DecomyardHoverCard from './DecomyardHoverCard';
import WindfarmHoverCard from './WindfarmHoverCard';
import PipelineHoverCard from './PipelineHoverCard';


const baseUrl = process.env.ENVIRONMENT === 'development' ? 'https://data.ogauthority.co.uk' : 'https://oga.azureedge.net';
const baseWMSUrl = baseUrl + '/arcgis/services';
const baseRESTUrl = baseUrl + '/arcgis/rest/services';
const bathymetryBaseUrl = process.env.ENVIRONMENT === 'development' ? 'https://tiles.emodnet-bathymetry.eu/v9/terrain' : 'https://emodnet-terrain.azureedge.net/v9/terrain';
const emodnetBaseUrl = process.env.ENVIRONMENT === 'development' ? 'https://ows.emodnet-bathymetry.eu/wms' : 'https://emodnet-ows.azureedge.net/wms';
const assetsBaseUrl = process.env.ENVIRONMENT === 'development' ? 'https://digitalnorthsea.blob.core.windows.net' : 'https://assets.digitalnorthsea.com';

let iconModels = {
    "FPSO":assetsBaseUrl+"/models/platform-types/FPSO/lp_fpsoplat.gltf",
    "FPU": assetsBaseUrl+"/models/platform-types/FPU/fpu_lowpoly.gltf",
    "FPV":assetsBaseUrl+"/models/platform-types/FPV/lp_fpsoplat.gltf",
    "GravBase": assetsBaseUrl+"/models/platform-types/GravBase/lp_gravbase.gltf",
    "Jacket": assetsBaseUrl+"/models/platform-types/Jacket/lp_jacket.gltf",
    "Platform": assetsBaseUrl+"/models/platform-types/Jacket/lp_jacket.gltf",
    "FSO":assetsBaseUrl+"/models/platform-types/FPU/fpu_lowpoly.gltf"
    
};
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
        this.loadCesiumModelOntoMap = this.loadCesiumModelOntoMap.bind(this);
        this.source = CancelToken.source();
        this.state = {
            viewer: null,
            isHidden: false,
            positions: [],
            installations: [],
            decomyards: [],
            pipelines:[],
            currentInstallationFilter: null,
            currentDecomYardFilter: null,
            currentPipelineFilter: null,
            windfarms: [],
            currentWindfarmFilter: null,
            lastHoveredInstallation: null,
            lastHoveredDecomyard: null,
            lastHoveredWindfarm: null,
            lastHoveredPipeline: null,
        }
        
        this.state.installations = this.props.cesiumInstallations;
        if(this.props.cesiumDecomyards){
            this.state.decomyards = this.props.cesiumDecomyards;
        }
        if(this.props.cesiumPipelines){        
            this.state.pipelines = this.props.cesiumPipelines;
        }
    }

    updatePositions(positions) {
        this.setState({
            positions: positions
        })
        this.props.updatePositions(positions);
    }

    shouldComponentUpdate(nextProps, nextState) {
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
        if (this.state.viewer != null) {
            this.sortLayers(nextProps);            
            if (this.props.cesiumDecomyards.length === 0 && nextProps.cesiumDecomyards !== 0) {
                this.decomyardsPoints = this.loadUpDecomyards(nextProps);
            } 
            if (this.props.cesiumInstallations.length === 0 && nextProps.cesiumInstallations !== 0) {
                this.installationPoints = this.loadUpInstallations(nextProps);
            }
            if (this.props.cesiumWindfarms.length === 0 && nextProps.cesiumWindfarms !== 0) {
                this.windfarmPoints = this.loadUpWindfarms(nextProps);
            }  
            if (this.props.cesiumPipelines.length === 0 && nextProps.cesiumPipelines !== 0) {
                this.pipelinePoints = this.loadUpPipelines(nextProps);                        
            } 

            if (this.props.activeTab.name !== "Bathymetry" && nextProps.activeTab.name === "Bathymetry") {
                this.setUpBathymetry();

            } else if (this.props.activeTab.name === "Bathymetry" && nextProps.activeTab.name !== "Bathymetry") {
                this.clearBathymetry();
            }
            // if (this.props.installationFilter !== nextProps.installationFilter) {
            //     this.filterInstallations(nextProps.installationFilter);
            //     return true;
            // }

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
        } else if (this.props.activeTab.name === "Bathymetry") {
            this.setBatheymetryInCDM = true;
        }
        return false;
    }

    initialiseViewer() {
        var terrainProvider = new window.Cesium.CesiumTerrainProvider({
            url: bathymetryBaseUrl,
            credit: "EMODnet Bathymetry Consortium (2018): EMODnet Digital Bathymetry (DTM)"
        });
        var osm = window.Cesium.createOpenStreetMapImageryProvider({
            url : 'https://a.tile.openstreetmap.org/'
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
                imageryProvider : osm
            });

            viewer.scene.globe.enableLighting = false;
            viewer.scene.globe.depthTestAgainstTerrain = false;

            var provider = new window.Cesium.WebMapServiceImageryProvider({
                url : emodnetBaseUrl,
                layers : 'contours',
                parameters:{transparent:true,format:"image/png",cors:window.location.href }
            });
            
            viewer.imageryLayers.addImageryProvider(provider);
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

    componentDidMount() {
        this.initialiseViewer();
        var west = -15.0;
        var south = 60.0;
        var east = 10.0;
        var north = 30.0;
        var rectangle = window.Cesium.Rectangle.fromDegrees(west, south, east, north);
        // fly to the north sea
        this.state.viewer.camera.flyTo({
            destination: rectangle,
            duration: 3,
            orientation: {
                heading: 0.0,
                pitch: window.Cesium.Math.toRadians(285),
                roll: 0.0
            }
        });
        this.addHighlightHandlers();
        this.ogaFields = null;
        this.ogaLicenses = null;
        this.ogaQuadrants = null;
        this.ogaWells = null;
        this.ogaInfrastructure = null;
        if (this.setBatheymetryInCDM) {
            this.setUpBathymetry();
            this.setBatheymetryInCDM = false;
        }
    }

    componentWillUnmount() {
        this.source.cancel()
    }

    clearInstallations() {
        if(this.installationPoints!== undefined){
           for (var i = 0; i < this.installationPoints.length; i++) {
                this.state.viewer.entities.remove(this.installationPoints[i]);
            }
        }
    }

    clearDecomYards() {
        if(this.decomyardsPoints!== undefined){
            for (var i = 0; i < this.decomyardsPoints.length; i++) {
                this.state.viewer.entities.remove(this.decomyardsPoints[i]);
            }
        }
    }

    clearPipelines() {
        if(this.pipelinePoints!== undefined){
            for (var i = 0; i < this.pipelinePoints.length; i++) {
                this.state.viewer.entities.remove(this.pipelinePoints[i]);
            }
        }
    }
    
    clearWindfarms() {
        if(this.windfarmPoints !== undefined){
            for (var i = 0; i < this.windfarmPoints.length; i++) {
                this.state.viewer.entities.remove(this.windfarmPoints[i]);
            }
        }
    }

    removeBathymetryHandlers() {
        if (this.bathymetryHandler != null) {
            this.bathymetryHandler.destroy();
            // clean up old lines here.
            if (this.currentPath != null) {
                this.state.viewer.entities.remove(this.currentPath);
                this.setCurrentPath(null);
            }
            var currentLabels = this.getCurrentLabels();
            for (var i = 0; i < currentLabels.length; i++) {
                this.state.viewer.entities.remove(currentLabels[i]);
            }
            this.setCurrentLabels([]);

            this.bathymetryHandler = null;
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

    addBathymetryHandlers() {
        var handler = new window.Cesium.ScreenSpaceEventHandler(this.state.viewer.scene.canvas);
        const viewer = this.state.viewer;

        this.position = [];
        var position = this.position;
        const getMousePosition = this.getMousePosition;
        var linePosition = new window.Cesium.CallbackProperty(function (time) {
            var positions = position.slice(0);
            var mousePosition = getMousePosition();
            if (mousePosition !== null && mousePosition !== undefined) {
                positions.push(mousePosition);
            }
            return positions;
        }, false);

        function approxLengthFunc() {
            // Get the end position from the polyLine's callback.
            var endPoint = position[position.length - 1]
            var endCartographic = window.Cesium.Cartographic.fromCartesian(endPoint);
            var startPoint = position[position.length - 2]
            var startCartographic = window.Cesium.Cartographic.fromCartesian(startPoint);
            var geodesic = new window.Cesium.EllipsoidGeodesic();
            geodesic.setEndPoints(startCartographic, endCartographic);
            var lengthInMeters = Math.round(geodesic.surfaceDistance);
            return (lengthInMeters / 1000).toFixed(1) + ' km';
        };

        var approxLength = new window.Cesium.CallbackProperty(function (time) {
            // Get the end position from the polyLine's callback.
            var endPoint = getMousePosition()
            if (endPoint === undefined) { // off the globe case.
                return;
            }
            var endCartographic = window.Cesium.Cartographic.fromCartesian(endPoint);
            var startPoint = position[position.length - 1]
            var startCartographic = window.Cesium.Cartographic.fromCartesian(startPoint);
            var geodesic = new window.Cesium.EllipsoidGeodesic();
            geodesic.setEndPoints(startCartographic, endCartographic);
            var lengthInMeters = Math.round(geodesic.surfaceDistance);
            return (lengthInMeters / 1000).toFixed(1) + ' km';
        }, false);

        var labelPosition = new window.Cesium.CallbackProperty(function (time) {
            let position = getMousePosition();
            return position;
        }, false);

        var path;
        var lengthLabel;
        var dynamicLengthLabel;
        var firstPosition = true;
        var numberOfPoints = 1;
        const setMousePosition = this.setMousePosition;
        const setHandlerNull = this.setHandlerNull;
        const getHandlerNull = this.getHandlerNull;
        const setCurrentLabels = this.setCurrentLabels;
        const setCurrentPath = this.setCurrentPath;
        const getDynamicLengthlabel = this.getDynamicLengthlabel;
        const setDynamicLengthLabel = this.setDynamicLengthLabel;
        const updatePosition = this.updatePosition;
        const addLabel = this.addCurrentLabel;
        this.setHandlerNull(true);
        setDynamicLengthLabel(null);
        setCurrentLabels([]);

        handler.setInputAction(function (movement) {
            var p = viewer.camera.pickEllipsoid(movement.endPosition);
            setMousePosition(p);
        }, window.Cesium.ScreenSpaceEventType.MOUSE_MOVE);


        handler.setInputAction(function (movement) {
            if (!getHandlerNull()) {
                handler.setInputAction(function (movement) {
                }, window.Cesium.ScreenSpaceEventType.MOUSE_MOVE);
                var p = viewer.camera.pickEllipsoid(movement.position);
                position[numberOfPoints] = p;
                numberOfPoints++;
                setHandlerNull(true);
                lengthLabel = viewer.entities.add({
                    position: position[position.length - 1],
                    label: {
                        // This callback updates the length to print each frame.
                        text: approxLengthFunc(),
                        font: '20px sans-serif',
                        pixelOffset: new window.Cesium.Cartesian2(0.0, 20),
                        fillColor: window.Cesium.Color.WHITESMOKE,
                        style: window.Cesium.LabelStyle.FILL_AND_OUTLINE,
                        outlineColor: window.Cesium.Color.BLACK,
                        outlineWidth: 3
                    }
                });
                addLabel(lengthLabel);
                updatePosition(position);
                viewer.entities.remove(getDynamicLengthlabel());
                setDynamicLengthLabel(null);
            }
        }, window.Cesium.ScreenSpaceEventType.RIGHT_CLICK);

        function clickHandler(movement) {
            if (getHandlerNull()) {
                setHandlerNull(false);
                handler.setInputAction(function (movement) {
                    var p = viewer.camera.pickEllipsoid(movement.endPosition);
                    setMousePosition(p);
                }, window.Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            }
            var p = viewer.camera.pickEllipsoid(movement.position);
            if (p === undefined) {
                return;
            }
            if (firstPosition) {
                position[0] = p;
                position[numberOfPoints] = p;
                firstPosition = !firstPosition;
            } else {
                position[numberOfPoints] = p;
            }
            numberOfPoints++;
            if (path === undefined) {
                path = viewer.entities.add({
                    polyline: {
                        positions: linePosition,
                        width: 5.0,
                        material: new window.Cesium.PolylineOutlineMaterialProperty({
                            color: window.Cesium.Color.LIGHTCORAL,
                            outlineWidth: 2,
                            outlineColor: window.Cesium.Color.BLACK
                        }),
                        clampToGround: true
                    }
                });
                setCurrentPath(path);
            }

            var length = approxLengthFunc()
            if (length !== "0.0 km") {
                lengthLabel = viewer.entities.add({
                    position: position[position.length - 1],
                    label: {
                        // This callback updates the length to print each frame.
                        text: length,
                        font: '20px sans-serif',
                        pixelOffset: new window.Cesium.Cartesian2(0.0, 20),
                        fillColor: window.Cesium.Color.WHITESMOKE,
                        style: window.Cesium.LabelStyle.FILL_AND_OUTLINE,
                        outlineColor: window.Cesium.Color.BLACK,
                        outlineWidth: 3
                    }
                });
            }

            if (getDynamicLengthlabel() === null) {
                dynamicLengthLabel = viewer.entities.add({
                    position: labelPosition,
                    label: {
                        // This callback updates the length to print each frame.
                        text: approxLength,
                        font: '20px sans-serif',
                        pixelOffset: new window.Cesium.Cartesian2(0.0, 20),
                        fillColor: window.Cesium.Color.WHITESMOKE,
                        style: window.Cesium.LabelStyle.FILL_AND_OUTLINE,
                        outlineColor: window.Cesium.Color.BLACK,
                        outlineWidth: 3
                    }
                });
                setDynamicLengthLabel(dynamicLengthLabel);
                addLabel(dynamicLengthLabel);
            }

            addLabel(lengthLabel);
            updatePosition(position);
        }

        handler.setInputAction(function (movement) {
            clickHandler(movement);
        }, window.Cesium.ScreenSpaceEventType.LEFT_CLICK, window.Cesium.KeyboardEventModifier.CTRL);

        this.bathymetryHandler = handler;
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
                    color=window.Cesium.Color.GOLD
                } else if (previousPickedEntity.decomyard) {
                    color=window.Cesium.Color.AQUA
                } else {
                    color=window.Cesium.Color.WHITE
                }
                previousPickedEntity.point.color = color;
            }
            if (self.state.lastHoveredInstallation || self.state.lastHoveredDecomyard || self.state.lastHoveredWindfarm || self.state.lastHoveredPipeline) {
                self.setState({
                    lastHoveredInstallation: null,
                    lastHoveredDecomyard: null,
                    lastHoveredWindfarm: null,
                    lastHoveredPipeline: null
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
            }
        }, window.Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }

    clearBathymetry() {
        this.removeBathymetryHandlers();

        if (this.emod != null && this.coastline != null) {
            this.state.viewer.imageryLayers.remove(this.emod);
            this.state.viewer.imageryLayers.remove(this.coastline);
            this.emod = null;
            this.coastline = null;
        }

        if (this.ogaFields != null) {
            this.state.viewer.imageryLayers.remove(this.ogaFields);
            this.ogaFields = null;
        }

        if (this.ogaQuadrants != null) {
            this.state.viewer.imageryLayers.remove(this.ogaQuadrants);
            this.ogaQuadrants = null;
        }

        if (this.ogaWells != null) {
            this.state.viewer.imageryLayers.remove(this.ogaWells);
            this.ogaWells = null;
        }

        if (this.ogaLicenses != null) {
            this.state.viewer.imageryLayers.remove(this.ogaLicenses);
            this.ogaLicenses = null;
        }
        if (this.ogaInfrastructure != null) {
            this.state.viewer.imageryLayers.remove(this.ogaInfrastructure);
            this.ogaInfrastructure = null;
        }
    }

    loadCesiumModelOntoMap(assetId) {
        if (this.cesiumSketchfabModel) {
            this.state.viewer.scene.primitives.remove(this.cesiumSketchfabModel)
        }
        var tileset = this.state.viewer.scene.primitives.add(new window.Cesium.Cesium3DTileset({
            url: window.Cesium.IonResource.fromAssetId(assetId)
        }));
        this.cesiumSketchfabModel = tileset;
        let viewer = this.state.viewer
        let completeCallback = () => {
            viewer.camera.moveUp(50);
            viewer.camera.moveForward(30);
        }
        tileset.readyPromise.then(function (tileset) {
            var offset = new window.Cesium.HeadingPitchRange(20.5, -0.65, tileset.boundingSphere.radius * 1.40);
            viewer.camera.flyToBoundingSphere(tileset.boundingSphere, { offset: offset, complete: completeCallback })
        })
    }

    mouseEvent(e) {
        const picked = this.state.viewer.scene.pick(e.position);
        const id = picked ? picked.id || picked.primitive.id : null;
        if (picked && id) {
            if (id.installation !== undefined) {

                if (this.props.currentInstallation === id.installation) return; // if selecting already selected installation.

                // dot has been clicked.
                this.props.changeCurrentInstallation(id.installation);
                // if (id.installation.ProjectId) { // unselect if no project id is selected.
                //     history.push(`/projects/${id.installation.ProjectId}`);
                // } else {
                //     history.push(`/projects/`)
                // }

                if (id.installation.CesiumId) {
                    this.loadCesiumModelOntoMap(id.installation.CesiumId)
                }
            }
        }
    }

    // if cdn fails then replace with https://epm-oga.azureedge.net with https://itportal.ogauthority.co.uk/arcgis/services/OGA_Public_WGS84
    sortLayers(props) {
        var ogaFields = new window.Cesium.WebMapServiceImageryProvider({
            url: baseWMSUrl + '/OGA_Public_WGS84/OGA_Offshore_Fields_WGS84/MapServer/WMSServer',
            layers: '0',
            tilingScheme: new window.Cesium.GeographicTilingScheme(),
            parameters: {
                format: 'png32',
                transparent: true
            },
            enablePickFeatures: true,
            getFeatureInfoParameters: {
                info_format: "application/xml"
            },
            getFeatureInfoFormats: [new window.Cesium.GetFeatureInfoFormat('xml', 'text/xml', console.log)]
        });

        var ogaQuadrants = new window.Cesium.WebMapServiceImageryProvider({
            url: baseWMSUrl + '/OGA_Public_WGS84/OGA_Quadrants_WGS84/MapServer/WMSServer',
            layers: '0',
            tilingScheme: new window.Cesium.GeographicTilingScheme(),
            parameters: {
                format: 'png32',
                transparent: true
            },
            enablePickFeatures: true,
            getFeatureInfoParameters: {
                info_format: "application/xml"
            },
            getFeatureInfoFormats: [new window.Cesium.GetFeatureInfoFormat('xml', 'text/xml', console.log)]
        });

        var ogaWells = new window.Cesium.WebMapServiceImageryProvider({
            url: baseWMSUrl + '/OGA_Public_WGS84/OGA_Wells_WGS84/MapServer/WMSServer',
            layers: '0',
            tilingScheme: new window.Cesium.GeographicTilingScheme(),
            parameters: {
                format: 'png32',
                transparent: true
            },
            enablePickFeatures: true,
            getFeatureInfoParameters: {
                info_format: "application/xml"
            },
            getFeatureInfoFormats: [new window.Cesium.GetFeatureInfoFormat('xml', 'text/xml', console.log)]
        });

        var ogaLicenses = new window.Cesium.WebMapServiceImageryProvider({
            url: baseWMSUrl + '/OGA_Public_WGS84/OGA_Licences_WGS84/MapServer/WMSServer',
            layers: '0,1,2,3',
            tilingScheme: new window.Cesium.GeographicTilingScheme(),
            parameters: {
                format: 'png32',
                transparent: true
            },
            enablePickFeatures: true,
            getFeatureInfoParameters: {
                info_format: "application/xml"
            },
            getFeatureInfoFormats: [new window.Cesium.GetFeatureInfoFormat('xml', 'text/xml', console.log)]
        });

        var ogaInfrastructure = new window.Cesium.ArcGisMapServerImageryProvider({
            url: baseRESTUrl + '/OGA_CDA/CDA_Infrastructure_WGS84/MapServer/export',
            layers: '0,1,2',
            tilingScheme: new window.Cesium.GeographicTilingScheme(),
            parameters: {
                format: 'png32',
                transparent: true
            },
            enablePickFeatures: true,
            getFeatureInfoParameters: {
                info_format: "application/xml"
            },
            getFeatureInfoFormats: [new window.Cesium.GetFeatureInfoFormat('xml', 'text/xml', console.log)]
        });


        if (props.fieldState && this.ogaFields === null) {
            this.ogaFields = this.state.viewer.imageryLayers.addImageryProvider(ogaFields);
        } else if (!props.fieldState && this.ogaFields != null) {
            this.state.viewer.imageryLayers.remove(this.ogaFields);
            this.ogaFields = null;
        }
        if (props.quadrantsState && this.ogaQuadrants === null) {
            this.ogaQuadrants = this.state.viewer.imageryLayers.addImageryProvider(ogaQuadrants);
        } else if (!props.quadrantsState && this.ogaQuadrants != null) {
            this.state.viewer.imageryLayers.remove(this.ogaQuadrants);
            this.ogaQuadrants = null;
        }
        if (props.wellState && this.ogaWells === null) {
            this.ogaWells = this.state.viewer.imageryLayers.addImageryProvider(ogaWells);
        } else if (!props.wellState && this.ogaWells != null) {
            this.state.viewer.imageryLayers.remove(this.ogaWells);
            this.ogaWells = null;
        }
        if (props.licensesState && this.ogaLicenses === null) {
            this.ogaLicenses = this.state.viewer.imageryLayers.addImageryProvider(ogaLicenses);
        } else if (!props.licensesState && this.ogaLicenses != null) {
            this.state.viewer.imageryLayers.remove(this.ogaLicenses);
            this.ogaLicenses = null;
        }
        if (props.infrastructureState && this.ogaInfrastructure === null) {
            this.ogaInfrastructure = this.state.viewer.imageryLayers.addImageryProvider(ogaInfrastructure);
        } else if (!props.infrastructureState && this.ogaInfrastructure != null) {
            this.state.viewer.imageryLayers.remove(this.ogaInfrastructure);
            this.ogaInfrastructure = null;
        }
    }

    setUpBathymetry() {
        this.addBathymetryHandlers();
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
            var point = this.state.viewer.entities.add({
                name: installation["Name"],
                position: window.Cesium.Cartesian3.fromDegrees(installation.Longitude, installation.Latitude),
                point : {
                    pixelSize: 12,
                    color: window.Cesium.Color.GOLD,
                    outlineColor : window.Cesium.Color.BLACK,
                    outlineWidth: 1,
                    eyeOffset: new window.Cesium.Cartesian3(0, 0, 1),
                    distanceDisplayCondition: new window.Cesium.DistanceDisplayCondition(0.0, 8500009.5),
                    translucencyByDistance: new window.Cesium.NearFarScalar(2300009.5, 1, 8500009.5, 0.01),
                    heightReference : window.Cesium.HeightReference.CLAMP_TO_GROUND 
                },
                model:{
                    uri:model,
                    distanceDisplayCondition: new window.Cesium.DistanceDisplayCondition(0.0, 100000),
                    scale:0.18,
                    heightReference : window.Cesium.HeightReference.CLAMP_TO_GROUND,
                    shadows:window.Cesium.ShadowMode.DISABLED 
                },
                label:{
                    text:installation["Name"],
                    fillColor:window.Cesium.Color.WHITE,
                    style:window.Cesium.LabelStyle.FILL_AND_OUTLINE,
                    outlineColor : window.Cesium.Color.BLACK,
                    outlineWidth: 1.5,
                    pixelOffset: new  window.Cesium.Cartesian2(25, 0),
                    verticalOrigin : window.Cesium.VerticalOrigin.CENTER,
                    horizontalOrigin : window.Cesium.HorizontalOrigin.LEFT ,
                    distanceDisplayCondition: new window.Cesium.DistanceDisplayCondition(0.0, 50000),
                    heightReference : window.Cesium.HeightReference.CLAMP_TO_GROUND 
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
                    pixelSize: 12,
                    color: window.Cesium.Color.AQUA,
                    eyeOffset: new window.Cesium.Cartesian3(0, 0, 1),
                    distanceDisplayCondition: new window.Cesium.DistanceDisplayCondition(0.0, 8500009.5),
                    translucencyByDistance: new window.Cesium.NearFarScalar(2300009.5, 1, 8500009.5, 0.01),
                    heightReference : window.Cesium.HeightReference.CLAMP_TO_GROUND,
                    outlineColor : window.Cesium.Color.BLACK,
                    outlineWidth: 1, 
                },
                label:{
                    text:decomyard["Name"],
                    fillColor:window.Cesium.Color.WHITE,
                    style:window.Cesium.LabelStyle.FILL_AND_OUTLINE,
                    outlineColor : window.Cesium.Color.BLACK,
                    outlineWidth: 1.5,
                    pixelOffset: new  window.Cesium.Cartesian2(25, 0),
                    verticalOrigin : window.Cesium.VerticalOrigin.CENTER,
                    horizontalOrigin : window.Cesium.HorizontalOrigin.LEFT ,
                    distanceDisplayCondition: new window.Cesium.DistanceDisplayCondition(0.0, 50000),
                    heightReference : window.Cesium.HeightReference.CLAMP_TO_GROUND 
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

    loadUpPipelines(nextProps) {
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
        var materialHash = {};
        this.state.viewer.entities.suspendEvents();
        for (var i = 0; i < pipelines.length; i++) {
            var pipeline = pipelines[i];
            var coordinates = pipeline.Coordinates;
            if(Array.isArray(coordinates) && coordinates.length > 0){
                if(Array.isArray(coordinates[0])){
                    if(coordinates[0].length >0 && Array.isArray(coordinates[0][0])){
                        //console.log("multi line here");
                    }
                    else{
                        try{
                        let flatCoordinates = coordinates.flat();
                        var material = materialHash[pipeline["Fluid Conveyed"]];
            if (!material) {
                var color = window.Cesium.Color.fromRandom({
                    alpha : 1.0
                });
                // material = new window.Cesium.StripeMaterialProperty({
                //     // The newest part of the line is bright yellow.
                //     evenColor: color,
                //     // The oldest part of the line is yellow with a low alpha value.
                //     oddColor: color.withAlpha(0.1),
                //     repeat: 1,
                //     offset: 0.25,
                //     orientation: window.Cesium.StripeOrientation.VERTICAL
                // })
                materialHash[pipeline["Fluid Conveyed"]] = color;
            }
                        var poly =this.state.viewer.entities.add({
                            name: pipeline["Pipeline Name"],
                            position: window.Cesium.Cartesian3.fromDegrees(flatCoordinates[Math.floor((flatCoordinates.length - 1) / 2)]),
                            // polylineVolume : {
                            //     positions : window.Cesium.Cartesian3.fromDegreesArray(flatCoordinates),
                            //     shape : shape,
                            //     material : window.Cesium.Color.RED,
                            //     heightReference : window.Cesium.HeightReference.CLAMP_TO_GROUND ,
                            //     distanceDisplayCondition: new window.Cesium.DistanceDisplayCondition(0.0, 10000),
                            // },
                            polyline:{
                                positions : window.Cesium.Cartesian3.fromDegreesArray(flatCoordinates),
                                material : material,
                                heightReference : window.Cesium.HeightReference.CLAMP_TO_GROUND ,
                                // distanceDisplayCondition: new window.Cesium.DistanceDisplayCondition(100000, 50000000),
                            }
                            // label:{
                            //     text:pipeline["Pipeline Name"],
                            //     fillColor:window.Cesium.Color.WHITE,
                            //     style:window.Cesium.LabelStyle.FILL_AND_OUTLINE,
                            //     outlineColor : window.Cesium.Color.BLACK,
                            //     outlineWidth: 1.5,
                            //     pixelOffset: new  window.Cesium.Cartesian2(25, 0),
                            //     verticalOrigin : window.Cesium.VerticalOrigin.CENTER,
                            //     horizontalOrigin : window.Cesium.HorizontalOrigin.LEFT ,
                            //     distanceDisplayCondition: new window.Cesium.DistanceDisplayCondition(0.0, 50000),
                            //     heightReference : window.Cesium.HeightReference.CLAMP_TO_GROUND 
                            // }
                        });
                        poly.pipeline = pipeline;
                        pipelinePolys.push(poly);
                    }
                    catch(error){
                        errors.push({error:error, coordinates:coordinates.flat()});
                    }
                    }
                }

            }
        }
        if(errors.length > 0 ){
            console.error(errors);
        }
        this.state.viewer.entities.resumeEvents();   
        
        this.pipelinePoints = pipelinePolys;
        return pipelinePolys;
    }


    loadUpWindfarms(nextProps) {
        var windfarmsPoints = [];
        let windfarms;
        
        if (nextProps.cesiumWindfarms.length === 0) {
            windfarms = this.state.currentWindfarmsFilter ? this.state.currentWindfarmFilter(this.state.windfarms) : this.state.windfarms;
        } else {
            windfarms = this.state.currentWindfarmsFilter ? this.state.currentWindfarmFilter(nextProps.cesiumWindfarms) : nextProps.cesiumWindfarms;
        }

        if (!windfarms) return;
        
        for (var i = 0; i < windfarms.length; i++) {
            var windfarm = windfarms[i];

            if (!windfarm.LONGITUDE || !windfarm.LATITUDE) continue;
            var point = this.state.viewer.entities.add({
                name: windfarm["Name"],
                position: window.Cesium.Cartesian3.fromDegrees(windfarm.LONGITUDE, windfarm.LATITUDE),
                point: {
                    pixelSize: 12,
                    color: window.Cesium.Color.WHITE,
                    eyeOffset: new window.Cesium.Cartesian3(0, 0, 1),
                    distanceDisplayCondition: new window.Cesium.DistanceDisplayCondition(0.0, 8500009.5),
                    translucencyByDistance: new window.Cesium.NearFarScalar(2300009.5, 1, 8500009.5, 0.01),
                    heightReference : window.Cesium.HeightReference.CLAMP_TO_GROUND,
                    outlineColor : window.Cesium.Color.BLACK,
                    outlineWidth: 1, 
                },
                label:{
                    text:windfarm["Name"],
                    fillColor:window.Cesium.Color.WHITE,
                    style:window.Cesium.LabelStyle.FILL_AND_OUTLINE,
                    outlineColor : window.Cesium.Color.BLACK,
                    outlineWidth: 1.5,
                    pixelOffset: new  window.Cesium.Cartesian2(25, 0),
                    verticalOrigin : window.Cesium.VerticalOrigin.CENTER,
                    horizontalOrigin : window.Cesium.HorizontalOrigin.LEFT ,
                    distanceDisplayCondition: new window.Cesium.DistanceDisplayCondition(0.0, 50000),
                    heightReference : window.Cesium.HeightReference.CLAMP_TO_GROUND 
                }
            });
            point.windfarm = windfarm;
            windfarmsPoints.push(point);
        }
        this.windfarmsPoints = windfarmsPoints;
        return windfarmsPoints;
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
        
        return (
            <div style={{height:'100%', width:'100%'}}>
            <ReactCursorPosition style={{width:'100%', height:'100%', pointerEvents:'none'}}>
                <div id="cesiumContainer" style={divStyle} >
                </div>
                <InstallationHoverCard hoveredInstallation={hoveredInstallation}></InstallationHoverCard>
                <DecomyardHoverCard hoveredDecomyard={hoveredDecomyard}></DecomyardHoverCard>
                <WindfarmHoverCard hoveredWindfarm={hoveredWindfarm}> </WindfarmHoverCard>
                <PipelineHoverCard hoveredPipeline={hoveredPipeline}></PipelineHoverCard>
            </ReactCursorPosition>
            </div>
        );
    }
}


function mapDispatchToProps(dispatch) {
    return {
        changeCurrentInstallation: (currentInstallation) => {
            dispatch(changeCurrentInstallation(currentInstallation))
        },
        updatePositions: (positions) => {
            dispatch(updatePositions(positions))
        }
    }
}

const mapStateToProps = (state) => {
    let filterType = state.InstallationReducer.installationFilter
    let decomYardFilterType = state.InstallationReducer.decomYardFilterType
    let pipelineFilterType = state.InstallationReducer.pipelineFilterType
    let windfarmFilterType = state.InstallationReducer.windfarmFilterType
    return {
        activeTab: state.HeaderReducer.activeTab,
        currentInstallation: state.InstallationReducer.currentInstallation,
        cesiumInstallations: state.InstallationReducer.cesiumInstallations,
        cesiumDecomyards: state.InstallationReducer.cesiumDecomyards,
        cesiumPipelines: state.InstallationReducer.cesiumPipelines,
        installationFilter: filterType,
        decomYardFilter: decomYardFilterType,
        pipelineFilterType: pipelineFilterType,
        cesiumWindfarms: state.InstallationReducer.cesiumWindfarms,
        windfarmFilter: windfarmFilterType,
        fieldState: state.BathymetryReducer.ogaFieldsSwitched,
        quadrantsState: state.BathymetryReducer.ogaQuadrantsSwitched,
        wellState: state.BathymetryReducer.ogaWellsSwitched,
        licensesState: state.BathymetryReducer.ogaLicensesSwitched,
        infrastructureState: state.BathymetryReducer.ogaInfrastructureSwitched
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Map)
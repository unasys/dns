import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Map.scss';
import { changeCurrentInstallation, INSTALLATION_FILTER_TYPES } from '../../../actions/installationActions';
import history from '../../../history';
import { updatePositions } from '../../../actions/bathymetryActions';
import axios from 'axios';
import ReactCursorPosition from 'react-cursor-position';
import InstallationHoverCard from './InstallationHoverCard';
import DecomyardHoverCard from './DecomyardHoverCard';

const baseUrl = process.env.NODE_ENV === 'development' ? 'https://data.ogauthority.co.uk' : 'https://oga.azureedge.net';
const baseWMSUrl = baseUrl + '/arcgis/services'
const baseRESTUrl = baseUrl + '/arcgis/rest/services'
const bathymetryBaseUrl = process.env.NODE_ENV === 'development' ? 'https://tiles.emodnet-bathymetry.eu/v9/terrain' : 'https://emodnet-terrain.azureedge.net/v9/terrain'
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
            currentInstallationFilter: null,
            lastHoveredInstallation: null,
            lastHoveredDecomyard: null
        }

        this.state.installations = this.props.cesiumInstallations;
    }

    // filterInstallations(filterObject) {
    //     if (filterObject.type === INSTALLATION_FILTER_TYPES.WasteToEnergy) {
    //         let newFilter = (installations) => { return installations.filter(installation => { return installation.Type === "WasteToEnergy" }) }
    //         this.setState({
    //             currentInstallationFilter: newFilter
    //         }, () => { this.clearInstallations(); this.loadUpInstallations(this.props); })
    //     } else if (filterObject.type === INSTALLATION_FILTER_TYPES.Property) {
    //         let newFilter = (installations) => { return installations.filter(installation => { return installation[filterObject.propertyName] === filterObject.on }) };
    //         this.setState({
    //             currentInstallationFilter: newFilter
    //         }, () => { this.clearInstallations(); this.loadUpInstallations(this.props); })
    //     } else if (filterObject.type === INSTALLATION_FILTER_TYPES.OffshoreWind) {
    //         let newFilter = (installations) => { return installations.filter(installation => { return installation.Type === "OffshoreWind" }) };
    //         this.setState({
    //             currentInstallationFilter: newFilter
    //         }, () => { this.clearInstallations(); this.loadUpInstallations(this.props); })
    //     } else {
    //         let newFilter = (installations) => { return installations.filter(installation => { return installation.Type === "OilAndGas" }) }
    //         this.setState({
    //             currentInstallationFilter: newFilter
    //         }, () => { this.clearInstallations(); this.loadUpInstallations(this.props); })
    //     }
    // }

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
        if (this.state.viewer != null) {
            this.sortLayers(nextProps);
            if (this.installationPoints !== undefined) {
                this.clearInstallations();
            }
            this.installationPoints = this.loadUpInstallations(nextProps);
            this.decomyardsPoints = this.loadUpDecomyards(nextProps);
            if (this.props.activeTab.name !== "Bathymetry" && nextProps.activeTab.name === "Bathymetry") {
                this.setUpBathymetry();

            } else if (this.props.activeTab.name === "Bathymetry" && nextProps.activeTab.name !== "Bathymetry") {
                this.clearBathymetry();
            }
            // if (this.props.installationFilter !== nextProps.installationFilter) {
            //     this.filterInstallations(nextProps.installationFilter);
            //     return true;
            // }

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
        window.Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1NTA1NWNhOS0zZTM0LTRjMGQtYWZiOS1jMmVjNGEzMmIyYjYiLCJpZCI6MTcxMiwiaWF0IjoxNTI5NjcyOTkyfQ.myp1Pd92hNwkYb4boUV2eFu8EKBgWsFxDU_flX1TpX4';
        var terrainProvider = new window.Cesium.CesiumTerrainProvider({
            url: bathymetryBaseUrl,
        });
        this.terrainIsOn = true;
        //eslint-disable-next-line
        this.state.viewer =
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
                requestRenderMode: true
            })
        //this.filterInstallations(this.props.installationFilter);
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
        //this.fetchInstallations();
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
        //this.setUpCinemaMode(this.state.viewer)
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
        for (var i = 0; i < this.installationPoints.length; i++) {
            this.state.viewer.entities.remove(this.installationPoints[i]);
        }
    }

    refreshInstallations() {
        for (var i = 0; i < this.installationPoints.length; i++) {
            let point = this.installationPoints[i];
            this.state.viewer.entities.add({
                name: point.installation["Facility Name"],
                position: window.Cesium.Cartesian3.fromDegrees(point.installation.X, point.installation.Y),
                point: {
                    pixelSize: 10,
                    color: window.Cesium.Color.GOLD,
                    eyeOffset: new window.Cesium.Cartesian3(0, 0, 5),
                    distanceDisplayCondition: new window.Cesium.DistanceDisplayCondition(0.0, 8500009.5),
                    translucencyByDistance: new window.Cesium.NearFarScalar(2300009.5, 1, 8500009.5, 0.01)
                }
            });
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
        var previousLabel = undefined;
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
                } else {
                    color=window.Cesium.Color.AQUA
                }
                previousPickedEntity.point.color = color;
            }
            if (self.state.lastHoveredInstallation || self.state.lastHoveredDecomyard) {
                self.setState({
                    lastHoveredInstallation: null,
                    lastHoveredDecomyard: null
                })
            }
            // if (self.state.lastHoveredDecomyard) {
            //     self.setState({
            //         lastHoveredDecomyard: null
            //     })
            // }

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
                // previousLabel = viewer.entities.add({
                //     position: window.Cesium.Cartesian3.fromDegrees(pickedEntity.installation.X, pickedEntity.installation.Y),
                //     label: {
                //         text: pickedEntity.installation["Facility Name"],
                //         font: '18px Helvetica',
                //         fillColor: window.Cesium.Color.WHITE,
                //         horizontalOrigin: window.Cesium.HorizontalOrigin.CENTER,
                //         verticalOrigin: window.Cesium.VerticalOrigin.CENTER,
                //         eyeOffset: new window.Cesium.Cartesian3(0, 0, -5),
                //         pixelOffset: new window.Cesium.Cartesian2(200, 0),
                //         show: true,
                //         style: window.Cesium.LabelStyle.FILL_AND_OUTLINE,
                //         outlineColor: window.Cesium.Color.BLACK,
                //         outlineWidth: 3
                //     }
                // })
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
        console.log('loading sketchfab model...');
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
                if (id.installation.ProjectId) { // unselect if no project id is selected.
                    history.push(`/projects/${id.installation.ProjectId}`);
                } else {
                    history.push(`/projects/`)
                }

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
            //installations = this.state.currentInstallationFilter ? this.state.currentInstallationFilter(this.state.installations) : this.state.installations;
            installations = this.state.installations;
        } else {
            //installations = this.state.currentInstallationFilter ? this.state.currentInstallationFilter(nextProps.cesiumInstallations) : nextProps.cesiumInstallations;
            installations = nextProps.cesiumInstallations;
        }
        
        for (var i = 0; i < installations.length; i++) {
            var installation = installations[i];
            if (installation.id === "world-map") { continue; }

            var point = this.state.viewer.entities.add({
                name: installation["Facility Name"],
                position: window.Cesium.Cartesian3.fromDegrees(installation.Longitude, installation.Latitude),
                point: {
                    pixelSize: 10,
                    color: window.Cesium.Color.GOLD,
                    eyeOffset: new window.Cesium.Cartesian3(0, 0, 1),
                    distanceDisplayCondition: new window.Cesium.DistanceDisplayCondition(0.0, 8500009.5),
                    translucencyByDistance: new window.Cesium.NearFarScalar(2300009.5, 1, 8500009.5, 0.01)
                }
            });
            point.installation = installation;
            installationPoints.push(point);
            if (installation.pointCloud !== undefined) {
                var tileSet;
                if (installation.pointCloud.cesiumId !== undefined) {
                    tileSet = this.state.viewer.scene.primitives.add(new window.Cesium.Cesium3DTileset({
                        url: window.Cesium.IonResource.fromAssetId(installation.pointCloud.cesiumId)
                    }));
                } else {
                    tileSet = this.state.viewer.scene.primitives.add(new window.Cesium.Cesium3DTileset({
                        url: installation.pointCloud.tileSetUrl
                    }));
                }

                tileSet.style = new window.Cesium.Cesium3DTileStyle({
                    pointSize: 2
                });
            };
        }
        this.installationPoints = installationPoints;
        return installationPoints;
    }

    loadUpDecomyards(nextProps) {
        // this.state.viewer.screenSpaceEventHandler.setInputAction(this.mouseEvent, window.Cesium.ScreenSpaceEventType.LEFT_CLICK);
        var decomyardsPoints = [];
        let decomyards;
        
        if (nextProps.cesiumDecomyards.length === 0) {
            //installations = this.state.currentInstallationFilter ? this.state.currentInstallationFilter(this.state.installations) : this.state.installations;
            decomyards = this.state.decomyards;
        } else {
            //installations = this.state.currentInstallationFilter ? this.state.currentInstallationFilter(nextProps.cesiumInstallations) : nextProps.cesiumInstallations;
            decomyards = nextProps.cesiumDecomyards;
        }
        
        for (var i = 0; i < decomyards.length; i++) {
            var decomyard = decomyards[i];

            var point = this.state.viewer.entities.add({
                name: decomyard["Name"],
                position: window.Cesium.Cartesian3.fromDegrees(decomyard.Long, decomyard.Lat),
                point: {
                    pixelSize: 10,
                    color: window.Cesium.Color.AQUA,
                    eyeOffset: new window.Cesium.Cartesian3(0, 0, 1),
                    distanceDisplayCondition: new window.Cesium.DistanceDisplayCondition(0.0, 8500009.5),
                    translucencyByDistance: new window.Cesium.NearFarScalar(2300009.5, 1, 8500009.5, 0.01)
                }
            });
            point.decomyard = decomyard;
            decomyardsPoints.push(point);
        }
        this.decomyardsPoints = decomyardsPoints;
        return decomyardsPoints;
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
        
        return (
            <div style={{height:'100%', width:'100%'}}>
            <ReactCursorPosition style={{width:'100%', height:'100%', pointerEvents:'none'}}>
                <div id="cesiumContainer" style={divStyle} >
                </div>
                <InstallationHoverCard hoveredInstallation={hoveredInstallation}></InstallationHoverCard>
                <DecomyardHoverCard hoveredDecomyard={hoveredDecomyard}></DecomyardHoverCard>
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
    return {
        activeTab: state.HeaderReducer.activeTab,
        currentInstallation: state.InstallationReducer.currentInstallation,
        cesiumInstallations: state.InstallationReducer.cesiumInstallations,
        cesiumDecomyards: state.InstallationReducer.cesiumDecomyards,
        installationFilter: filterType,
        fieldState: state.BathymetryReducer.ogaFieldsSwitched,
        quadrantsState: state.BathymetryReducer.ogaQuadrantsSwitched,
        wellState: state.BathymetryReducer.ogaWellsSwitched,
        licensesState: state.BathymetryReducer.ogaLicensesSwitched,
        infrastructureState: state.BathymetryReducer.ogaInfrastructureSwitched
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Map)
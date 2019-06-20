import React, { Component } from 'react';
import Router from './routing/Router';
import { getContentForDocument } from '../../../../api/Documents';
import { convertFileType } from '../Utils';
import FileViewerWindow from '../fileviewer/FileViewerWindow';
import JpgViewerWindow from '../fileviewer/JpgViewerWindow';
import StructuralDrawingRouter from './routing/StructuralDrawingRouter';
import { changeSketchfabId, changeAnnotationIndex } from '../../../../actions/sketchfabActions';
import { connect } from 'react-redux';
import axios from 'axios';
import { fetchProjectConfig } from '../../../../api/Project';
import DefaultRouter from './routing/DefaultRouter';
import Chevron from '../../../../assets/icons/Chevron';

const CancelToken = axios.CancelToken;

class DataRoomNew extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lastClickedDocument: null,
            documentType: null,
            projectConfig: null,
            showTiles: true
        }
        this.documentOnClick = this.documentOnClick.bind(this);
        this.documentTypeSelected = this.documentTypeSelected.bind(this);
        this.source = CancelToken.source();
        this.onEntityClick = this.onEntityClick.bind(this);
        this.toggleShowTiles = this.toggleShowTiles.bind(this);
    }

    componentDidMount() {
        fetchProjectConfig(this.props.match.params.currentProjectId, this.source.token).then(payload => {
            this.setState({
                isLoading: false,
                projectConfig: payload.data
            })
            return payload;
        })
            .catch((e) => {
                if (!axios.isCancel(e)) {
                    console.error('something went wrong when fetching installations in definitionandstatus.js', e);
                }
            })
    }

    toggleShowTiles() {
        this.setState({
            showTiles: !this.state.showTiles
        })
    }

    documentOnClick(document) {
        let currentRevision = document.currentRevision;
        let fileType = currentRevision.fileType;

        if (fileType) {
            getContentForDocument(document.currentRevision.content).then(res => {
                this.setState({
                    lastClickedDocument: { filePath: res.data, fileType: convertFileType(fileType) }
                })
            })
        }
    }

    documentTypeSelected(documentType) {
        this.setState({
            documentType: documentType
        })
    }

    onEntityClick(id) {
        if (this.state.projectConfig !== null && this.state.projectConfig.ModelAnnotation && this.state.projectConfig.ModelAnnotation[id]) {
            this.state.projectConfig.ModelAnnotation[id].forEach(annotationConf => {
                this.props.changeAnnotation(annotationConf.modelId, annotationConf.annotationid)
            });
        }
    }

    render() {
        let fileViewer = <></>

        if (this.state.lastClickedDocument !== null) {
            switch (this.state.lastClickedDocument.fileType) {
                case "jpeg":
                    fileViewer = (
                        <JpgViewerWindow lastClickedDocument={this.state.lastClickedDocument}></JpgViewerWindow>
                    )
                    break;
                case "pdf":
                    fileViewer = (
                        <FileViewerWindow
                            document={this.state.lastClickedDocument}>
                        </FileViewerWindow>
                    )
                    break;
                default:
                    fileViewer = <div>File type not supported</div>
            }
        }

        let router;
        if (this.state.documentType && this.state.documentType.name === 'Structural Drawings') {
            router = <StructuralDrawingRouter
                projectId={this.props.match.params.currentProjectId}
                documentType={this.state.documentType}
                documentTypeSelected={this.documentTypeSelected}
                onEntityClick={this.onEntityClick}
                documentOnClick={this.documentOnClick}>
            </StructuralDrawingRouter>
        }
        else if (this.state.documentType && this.state.documentType.name === "P&ID") {
            router = <Router
                projectId={this.props.match.params.currentProjectId}
                documentType={this.state.documentType}
                documentTypeSelected={this.documentTypeSelected}
                documentOnClick={this.documentOnClick}
                onEntityClick={this.onEntityClick}>
            </Router>
        } else {
            router = <DefaultRouter
                projectId={this.props.match.params.currentProjectId}
                documentTypeSelected={this.documentTypeSelected}
                documentOnClick={this.documentOnClick}
                onEntityClick={this.onEntityClick}>
            </DefaultRouter>
        }
        return (
            <div>
                {fileViewer}
                <div className="hide-tiles-control" onClick={this.toggleShowTiles}>
                    <div>
                        Hide Tiles
                        <Chevron size="10px"></Chevron>
                    </div>
                </div>
                {this.state.showTiles && router}
            </div>
        )
    }
}


function mapDispatchToProps(dispatch) {
    return {
        changeSketchfabId: (sketchfabId) => {
            dispatch(changeSketchfabId(sketchfabId));
        },
        changeAnnotation: (modelId, annotationIndex) => {
            dispatch(changeAnnotationIndex(modelId, annotationIndex));
        }
    }
}

export default connect(null, mapDispatchToProps)(DataRoomNew)
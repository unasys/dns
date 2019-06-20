import React from 'react';
import InitialSelectionTiles from "./routing/InitialSelectionTiles";
import FacilityRouter from './routing/FacilityRouter';
import { fetchProjectConfig } from '../../../../api/Project';
import axios from 'axios';
import DisciplineRouter from './routing/DisciplineRouter';
import { connect } from 'react-redux';
import SystemRouter from './routing/SystemRouter';
import { changeSketchfabId, changeAnnotationIndex } from '../../../../actions/sketchfabActions';

const CancelToken = axios.CancelToken;

class DefinitionNew extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            initialPathSelected: null,
            projectConfig: null
        }
        this.initialTypeSelected = this.initialTypeSelected.bind(this);
        this.onEntityClick = this.onEntityClick.bind(this);
        this.source = CancelToken.source();
    }

    componentDidMount() {
        fetchProjectConfig(this.props.projectId, this.source.token).then(payload => {
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

    // Used to change model depending on last clicked title.
    onEntityClick(id) {
        if (this.state.projectConfig !== null && this.state.projectConfig.ModelAnnotation && this.state.projectConfig.ModelAnnotation[id]) {
            this.state.projectConfig.ModelAnnotation[id].forEach(annotationConf => {
                this.props.changeAnnotation(annotationConf.modelId, annotationConf.annotationid)
            });
        }
    }

    initialTypeSelected(filterType) {
        this.setState({
            initialPathSelected: filterType
        })
    }

    getRouter(path) {
        let ptl = path.name.toString().toLowerCase();
        if (ptl === 'facilities') {
            return <FacilityRouter
                projectId={this.props.projectId}
                initialPath={path}
                onEntityClick={this.onEntityClick}
                initialPathSelected={this.initialTypeSelected}>
            </FacilityRouter>;
        }
        if (ptl === 'disciplines') {
            return <DisciplineRouter
                projectId={this.props.projectId}
                initialPath={path}
                onEntityClick={this.onEntityClick}
                initialPathSelected={this.initialTypeSelected}>
            </DisciplineRouter>;
        }
        if (ptl === 'systems') {
            return <SystemRouter
                projectId={this.props.projectId}
                initialPath={path}
                onEntityClick={this.onEntityClick}
                initialPathSelected={this.initialTypeSelected}>
            </SystemRouter>;
        }
    }

    render() {
        return (
            this.state.initialPathSelected ?
                this.getRouter(this.state.initialPathSelected)
                :
                <InitialSelectionTiles
                    initialTypeSelected={this.initialTypeSelected}
                >
                </InitialSelectionTiles>
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

export default connect(null, mapDispatchToProps)(DefinitionNew)

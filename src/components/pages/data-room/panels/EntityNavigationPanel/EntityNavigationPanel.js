import React from 'react';
import FilterTypeSelector from './FilterTypeSelector';
import Breadcrumbs from '../../../../breadcrumbs/Breadcrumbs';
import FacilitiesPanel from '../Facilities/FacilitiesPanel';
import DisciplinePanel from '../Disciplines/DisciplinePanel';
import { connect } from 'react-redux';
import { changeSketchfabId, changeAnnotationIndex } from '../../../../../actions/sketchfabActions';
import AreaPanel from '../Areas/AreaPanel';
import { fetchProjectConfig } from '../../../../../api/Project';
import axios from 'axios';
import { getContentForDocument } from '../../../../../api/Documents';
import { convertFileType } from '../../Utils';
import DetailsPanel from '../DetailsPanel/DetailsPanel';

const CancelToken = axios.CancelToken;


class EntityNavigationPanel extends React.Component {
    constructor(props) {
        super(props);
        this.clearFilterType = this.clearFilterType.bind(this);
        this.onFilterTypeClick = this.onFilterTypeClick.bind(this);
        this.onDocumentClick = this.onDocumentClick.bind(this);
        this.addToBreadcrumbs = this.addToBreadcrumbs.bind(this);
        this.updateBreadcrumbName = this.updateBreadcrumbName.bind(this);
        this.removeBreadcrumbsAfterIndex = this.removeBreadcrumbsAfterIndex.bind(this);
        this.onEntityClick = this.onEntityClick.bind(this);
        this.clearDocumentSelected = this.clearDocumentSelected.bind(this);
        this.onViewClick = this.onViewClick.bind(this);
        this.state = {
            filterTypeSelected: null,
            breadcrumbName: '',
            breadcrumbs: [{ name: '', title: 'Data Room', onClick: this.clearFilterType }],
            selectedDocument: [],
            projectConfig: null
        }
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

    addToBreadcrumbs(crumb) {
        this.setState({
            breadcrumbs: this.state.breadcrumbs.concat(crumb)
        })
    }

    updateBreadcrumbName(oldName, newName) {
        let newBreadcrumbs = this.state.breadcrumbs.map(breadcrumb => {
            if (breadcrumb.name === oldName) {
                breadcrumb.name = newName;
            }
            return breadcrumb;
        });
        this.setState({
            breadcrumbs: newBreadcrumbs
        })
    }

    removeBreadcrumbsAfterIndex(index) {
        let breadcrumbs = this.state.breadcrumbs.slice(0, index + 1)
        breadcrumbs[index].name = ''
        this.setState({
            breadcrumbs: breadcrumbs
        })
    }

    onFilterTypeClick(filterType) {
        let newBreadcrumbName = `${filterType}`;
        this.updateBreadcrumbName(this.state.breadcrumbName, newBreadcrumbName);
        this.setState({
            filterTypeSelected: filterType,
            breadcrumbName: '',
        })
    }

    clearFilterType() {
        this.setState({
            filterTypeSelected: null
        })
    }

    getFilterTypeComponent(filterType) {
        switch (filterType) {
            case 'Facilities':
                return <FacilitiesPanel
                    projectId={this.props.projectId}
                    makeWideWidth={this.props.makeWideWidth}
                    addToBreadcrumbs={this.addToBreadcrumbs}
                    updateBreadcrumbName={this.updateBreadcrumbName}
                    selectedDocument={this.state.selectedDocument}
                    onDocumentClick={this.onDocumentClick}
                    onEntityClick={this.onEntityClick}>
                </FacilitiesPanel>;
            case 'Disciplines':
                return <DisciplinePanel
                    projectId={this.props.projectId}
                    addToBreadcrumbs={this.addToBreadcrumbs}
                    updateBreadcrumbName={this.updateBreadcrumbName}
                    selectedDocument={this.state.selectedDocument}
                    onDocumentClick={this.onDocumentClick}
                    onEntityClick={this.onEntityClick}>
                </DisciplinePanel>;
            case 'Areas':
                return <AreaPanel
                    projectId={this.props.projectId}
                    addToBreadcrumbs={this.addToBreadcrumbs}
                    updateBreadcrumbName={this.updateBreadcrumbName}
                    selectedDocument={this.state.selectedDocument}
                    onDocumentClick={this.onDocumentClick}
                    onEntityClick={this.onEntityClick}>
                </AreaPanel>
            default:
                return <div>Could not filter on unsupported property</div>;
        }
    }

    onViewClick(document) {
        let fileType = document.currentRevision.fileType;
        if (fileType) {
            getContentForDocument(document.currentRevision.content).then(res => {
                this.props.onDisplayFileViewer(res.data, convertFileType(fileType));
            })
        } else {
            let externalSourceUrl = document.currentRevision.externalSourceUrl
            this.props.onDisplayFileViewer(externalSourceUrl, null);
        }
    }

    onDocumentClick(doc) {
        this.setState({
            selectedDocument: [doc]
        })
        this.onViewClick(doc);
        this.props.onDocSelect([doc]);
    }

    clearDocumentSelected() {
        this.setState({
            selectedDocument: []
        })
        this.props.onDocSelect([]);
    }

    onEntityClick(id) {
        if (this.state.projectconfig !== null && this.state.projectConfig.ModelAnnotation && this.state.projectConfig.ModelAnnotation[id]) {
            this.state.projectConfig.ModelAnnotation[id].forEach(annotationConf => {
                this.props.changeAnnotation(annotationConf.modelId, annotationConf.annotationid)
            });
        }
    }

    render() {
        let leftContent = this.getFilterTypeComponent('Facilities')
        //(this.state.filterTypeSelected === null ?
        //<FilterTypeSelector onFilterTypeClick={this.onFilterTypeClick}> </FilterTypeSelector> :
        //this.getFilterTypeComponent(this.state.filterTypeSelected)

        let content =
            <div style={{ display: 'flex' }}>
                <div style={{ width: this.state.selectedDocument.length === 0 ? "100%" : "50%" }}>
                    {leftContent}
                </div>
                {this.state.selectedDocument.length > 0 &&
                    <div style={{ width: "50%" }}>
                        <DetailsPanel
                            selectedDocuments={this.state.selectedDocument}
                            onDisplayFileViewer={this.props.onDisplayFileViewer}>
                        </DetailsPanel>
                    </div>}
            </div>

        let wrappedContent =
            <Breadcrumbs
                crumbs={this.state.breadcrumbs}
                removeCrumbs={this.removeBreadcrumbsAfterIndex}
                onCrumbClickHook={this.clearDocumentSelected}>
                {content}
            </Breadcrumbs>

        return (
            <div>
                {wrappedContent}
            </div>
        );
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

export default connect(null, mapDispatchToProps)(EntityNavigationPanel)
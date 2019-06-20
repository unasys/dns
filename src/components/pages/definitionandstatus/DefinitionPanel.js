import React from 'react';
import FilterTypeSelector from './FilterTypeSelector';
import Breadcrumbs from '../../breadcrumbs/Breadcrumbs';
import SlidingPanel from '../../sliding-panels/SlidingPanel';
import FacilitiesPanel from './facilities/FacilitiesPanel';
import DisciplinePanel from './disciplines/DisciplinePanel';
import SystemPanel from './systems/SystemPanel';
import TagDetailsPanel from '../../sliding-panels/panels/details-panel/tag-details-panel/TagDetailsPanel';
import { connect } from 'react-redux';
import { changeSketchfabId, changeAnnotationIndex } from '../../../actions/sketchfabActions';
import EntityDetailsPanel from '../../sliding-panels/panels/details-panel/tag-details-panel/EntityDetailsPanel';
import { getAuxiliaryData } from '../../../api/Entities';
import axios from 'axios';
import ActivityStepsBox from './ActivityStepsBox';

const CancelToken = axios.CancelToken;

class DefinitionPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filterTypeSelected: null,
            breadcrumbName: '',
            breadcrumbTitle: 'Def & Status',
            selectedTag: null,
            lastSelectedEntity: null,
            activitySteps: null,
            entityAuxiliaryData: null,
            entityDocuments: null

        }
        this.onFilterTypeClick = this.onFilterTypeClick.bind(this);
        this.clearFilterType = this.clearFilterType.bind(this);
        this.onTagClick = this.onTagClick.bind(this);
        this.props.addToBreadcrumbs({ name: this.state.breadcrumbName, title: this.state.breadcrumbTitle, onClick: this.clearFilterType });
        this.onEntityClick = this.onEntityClick.bind(this);
        this.setEntityPanelEmpty = this.setEntityPanelEmpty.bind(this);
        this.source = CancelToken.source();
        this.fetchAuxiliaryData = this.fetchAuxiliaryData.bind(this);
        this.setActivitySteps = this.setActivitySteps.bind(this);
        this.closeActivityStepsBox = this.closeActivityStepsBox.bind(this);
    }

    setActivitySteps(activitySteps) {
        this.setState({
            activitySteps: activitySteps
        })
    }

    closeActivityStepsBox() {
        this.setActivitySteps(null);
    }

    onFilterTypeClick(filterType) {
        let newBreadcrumbName = `${filterType}`;
        this.props.updateBreadcrumbName(this.state.breadcrumbName, newBreadcrumbName);
        this.setState({
            filterTypeSelected: filterType,
            breadcrumbName: newBreadcrumbName
        })
    }

    setEntityPanelEmpty(entityPanelEmpty) {
        this.setState({
            entityPanelEmpty: entityPanelEmpty
        })
    }

    clearFilterType() {
        this.setState({
            filterTypeSelected: null,
            breadcrumbName: ''
        })
    }

    getFilterTypeComponent(filterType) {
        switch (filterType) {
            case 'Facilities':
                return <FacilitiesPanel
                    projectId={this.props.projectId}
                    addToBreadcrumbs={this.props.addToBreadcrumbs}
                    updateBreadcrumbName={this.props.updateBreadcrumbName}
                    onTagClick={this.onTagClick}
                    selectedTag={this.state.selectedTag}
                    onEntityClick={this.onEntityClick}>
                </FacilitiesPanel>;
            case 'Disciplines':
                return <DisciplinePanel
                    projectId={this.props.projectId}
                    addToBreadcrumbs={this.props.addToBreadcrumbs}
                    updateBreadcrumbName={this.props.updateBreadcrumbName}
                    onTagClick={this.onTagClick}
                    selectedTag={this.state.selectedTag}
                    onEntityClick={this.onEntityClick}>
                </DisciplinePanel>;
            case 'Systems':
                return <SystemPanel
                    projectId={this.props.projectId}
                    addToBreadcrumbs={this.props.addToBreadcrumbs}
                    updateBreadcrumbName={this.props.updateBreadcrumbName}
                    onTagClick={this.onTagClick}
                    selectedTag={this.state.selectedTag}
                    onEntityClick={this.onEntityClick}>
                </SystemPanel>;
            default:
                return <div>Could not filter on unsupported property</div>;
        }
    }

    onTagClick(tag) {
        this.setState({
            selectedTag: tag
        })
    }

    onEntityClick(id) {
        // check config for model/annotation. 
        this.setState({
            lastSelectedEntity: id,
            entityAuxiliaryData: null,
            entityDocuments: [],
        })
        this.fetchAuxiliaryData(id);

        if (this.props.projectConfig !== null && this.props.projectConfig.ModelLookup && this.props.projectConfig.ModelLookup[id]) {
            this.props.changeSketchfabId(this.props.projectConfig.ModelLookup[id]);
        } else if (this.props.projectconfig !== null && this.props.projectConfig.ModelAnnotation && this.props.projectConfig.ModelAnnotation[id]) {
            this.props.projectConfig.ModelAnnotation[id].forEach(annotationConf => {
                this.props.changeAnnotation(annotationConf.modelId, annotationConf.annotationid)
            });
        }
    }

    fetchAuxiliaryData(id) {
        getAuxiliaryData(this.props.projectId, id, this.source.token).then(auxiliaryData => {
            if (auxiliaryData.status === 404) {
                return;
            }
            this.setState({
                entityAuxiliaryData: auxiliaryData.data
            })
        })
    }

    render() {
        let panelOneWidth = (this.state.selectedTag || this.state.entityAuxiliaryData) ? '50%' : '100%';
        let content = (this.state.filterTypeSelected === null ?
            <FilterTypeSelector onFilterTypeClick={this.onFilterTypeClick}> </FilterTypeSelector> :
            <div style={{ display: 'flex' }}>
                <div style={{ width: panelOneWidth, height: '85%' }}>
                    {this.getFilterTypeComponent(this.state.filterTypeSelected)}
                </div>
                {this.state.selectedTag !== null && <div style={{ width: '50%' }}>
                    <TagDetailsPanel projectId={this.props.projectId} tag={this.state.selectedTag}></TagDetailsPanel>}
                </div>}
                {this.state.selectedTag === null && this.state.entityAuxiliaryData && <div style={{ width: '50%' }}>
                    <EntityDetailsPanel
                        setActivitySteps={this.setActivitySteps}
                        projectId={this.props.projectId}
                        entityId={this.state.lastSelectedEntity}
                        auxiliaryData={this.state.entityAuxiliaryData}>
                    </EntityDetailsPanel></div>}
            </div>)

        let wrappedContent =
            <div>
                <Breadcrumbs crumbs={this.props.breadcrumbs} removeCrumbs={this.props.removeBreadcrumbsAfter}>
                    {<div>
                        {content}
                    </div>}
                </Breadcrumbs>
            </div>

        return (
            <div>
                <SlidingPanel content={wrappedContent} isSmallWidth={!this.state.filterTypeSelected || (!this.state.selectedTag && !this.state.entityAuxiliaryData)}></SlidingPanel>
                {this.state.activitySteps &&
                    <ActivityStepsBox
                        activitySteps={this.state.activitySteps.steps}
                        narrative={this.state.activitySteps.narrative}
                        closeActivitySteps={this.closeActivityStepsBox}>
                    </ActivityStepsBox>}
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

export default connect(null, mapDispatchToProps)(DefinitionPanel)
import React from 'react';
import CriticalitySelector from './CriticalitySelector';
import Breadcrumbs from '../../breadcrumbs/Breadcrumbs';
import SlidingPanel from '../../sliding-panels/SlidingPanel';
import EquipmentTypePanel from './equipmenttypes/EquipmentTypePanel';
import TagDetailsPanel from '../../sliding-panels/panels/details-panel/tag-details-panel/TagDetailsPanel';

class AssetPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            criticalitySelected: '',
            breadcrumbName: '',
            breadcrumbTitle: 'Criticality',
            selectedTag: null
        }
        this.onCriticalityClick = this.onCriticalityClick.bind(this);
        this.clearCriticality = this.clearCriticality.bind(this);
        this.onTagClick = this.onTagClick.bind(this);
        this.props.addToBreadcrumbs({ name: this.state.breadcrumbName, title: this.state.breadcrumbTitle, onClick: this.clearCriticality });
    }

    onCriticalityClick(critical) {
        let newBreadcrumbName = `${critical}`;
        this.props.updateBreadcrumbName(this.state.breadcrumbName, newBreadcrumbName);
        this.setState({
            criticalitySelected: critical,
            breadcrumbName: newBreadcrumbName
        })
    }

    clearCriticality() {
        this.setState({
            criticalitySelected: '',
            breadcrumbName: ''
        })
    }

    onTagClick(tag) {
        this.setState({
            selectedTag: tag
        })
    }

    render() {
        let leftContent = (this.state.criticalitySelected === '' ?
            <CriticalitySelector onCriticalityClick={this.onCriticalityClick}> </CriticalitySelector> :
            <EquipmentTypePanel
                projectId={this.props.projectId}
                critical={this.state.criticalitySelected}
                addToBreadcrumbs={this.props.addToBreadcrumbs}
                updateBreadcrumbName={this.props.updateBreadcrumbName}
                onTagClick={this.onTagClick}>
            </EquipmentTypePanel>)

        let panelOneWidth = this.state.selectedTag !== null ? '50%' : '100%'
        let content =
            <div style={{ display: 'flex' }}>
                <div style={{ width: panelOneWidth, height: '85%' }}>
                    {leftContent}
                </div>
                {this.state.selectedTag !== null && <div style={{ width: '50%' }}>
                    <TagDetailsPanel projectId={this.props.projectId} tag={this.state.selectedTag}></TagDetailsPanel>}
                </div>}
            </div>

        let wrappedContent =
            <Breadcrumbs crumbs={this.props.breadcrumbs} removeCrumbs={this.props.removeBreadcrumbsAfter}>
                {content}
            </Breadcrumbs>

        return (
            <div>
                <SlidingPanel content={wrappedContent} isSmallWidth={!this.state.selectedTag}></SlidingPanel>
            </div>
        );
    }
}

export default AssetPanel;


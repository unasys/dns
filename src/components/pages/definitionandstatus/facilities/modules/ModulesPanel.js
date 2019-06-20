import React from 'react';
import ModuleSelector from '../../../../selectors/ModuleSelector';
import AreaPanel from '../areas/AreaPanel';

class ModulesPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            moduleSelected: null,
            breadcrumbName: '',
            breadcrumbTitle: 'Module'
        }

        this.onModuleSelected = this.onModuleSelected.bind(this);
        this.clearModuleSelected = this.clearModuleSelected.bind(this);

        this.props.addToBreadcrumbs({ name: this.state.breadcrumbName, title: this.state.breadcrumbTitle, onClick: this.clearModuleSelected });
    }

    onModuleSelected(moduleParam) {
        let newBreadcrumbName = `${moduleParam.name}`;
        this.props.updateBreadcrumbName(this.state.breadcrumbName, newBreadcrumbName);
        this.setState({
            moduleSelected: moduleParam,
            breadcrumbName: newBreadcrumbName
        })
        this.props.onEntityClick(moduleParam.id);
    }

    clearModuleSelected() {
        this.setState({
            moduleSelected: null,
            breadcrumbName: ''
        })
    }

    render() {
        return (this.state.moduleSelected === null ?
            <ModuleSelector
                tagCount={true}
                urlParams={{ facilityId: this.props.facility.id }}
                onModuleSelected={this.onModuleSelected}
                projectId={this.props.projectId}>
            </ModuleSelector>
            :
            <AreaPanel
                facility={this.props.facility}
                module={this.state.moduleSelected}
                projectId={this.props.projectId}
                addToBreadcrumbs={this.props.addToBreadcrumbs}
                updateBreadcrumbName={this.props.updateBreadcrumbName}
                onTagClick={this.props.onTagClick}
                selectedTag={this.props.selectedTag}
                onEntityClick={this.props.onEntityClick}>
            </AreaPanel>
        )
    }
}

export default ModulesPanel;

import React from 'react';
import SystemSelector from '../../../selectors/SystemSelector';
import SubsystemPanel from './subsystems/SubsystemPanel';

class SystemPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            systemSelected: null,
            breadcrumbName: '',
            breadcrumbTitle: 'System'
        }

        this.onSystemSelected = this.onSystemSelected.bind(this);
        this.clearSystemSelected = this.clearSystemSelected.bind(this);

        this.props.addToBreadcrumbs({ name: this.state.breadcrumbName, title: this.state.breadcrumbTitle, onClick: this.clearSystemSelected });
    }

    onSystemSelected(system) {
        let newBreadcrumbName = `${system.name}`;
        this.props.updateBreadcrumbName(this.state.breadcrumbName, newBreadcrumbName);
        this.setState({
            systemSelected: system,
            breadcrumbName: newBreadcrumbName
        })
        this.props.onEntityClick(system.id);
    }

    clearSystemSelected() {
        this.setState({
            systemSelected: null,
            breadcrumbName: ''
        })
    }

    render() {
        return (<div>
            {this.state.systemSelected === null ?
                <SystemSelector
                    tagCount={true}
                    onSystemSelected={this.onSystemSelected}
                    projectId={this.props.projectId}>
                </SystemSelector>
                :
                <SubsystemPanel
                    system={this.state.systemSelected}
                    projectId={this.props.projectId}
                    addToBreadcrumbs={this.props.addToBreadcrumbs}
                    updateBreadcrumbName={this.props.updateBreadcrumbName}
                    onTagClick={this.props.onTagClick}
                    selectedTag={this.props.selectedTag}
                    onEntityClick={this.props.onEntityClick}>
                </SubsystemPanel>
            }
        </div>)
    }
}

export default SystemPanel;

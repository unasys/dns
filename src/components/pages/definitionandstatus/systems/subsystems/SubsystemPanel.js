import React from 'react';
import EquipmentPanel from '../equipment/EquipmentPanel';
import SubsystemSelector from '../../../../selectors/SubsystemSelector';

class SubsystemPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            subsystemSelected: null,
            breadcrumbName: '',
            breadcrumbTitle: 'Subsystem'
        }

        this.onSubsystemSelected = this.onSubsystemSelected.bind(this);
        this.clearSubsystemSelected = this.clearSubsystemSelected.bind(this);

        this.props.addToBreadcrumbs({ name: this.state.breadcrumbName, title: this.state.breadcrumbTitle, onClick: this.clearSubsystemSelected });
    }

    onSubsystemSelected(subsystem) {
        let newBreadcrumbName = `${subsystem.detail}`;
        this.props.updateBreadcrumbName(this.state.breadcrumbName, newBreadcrumbName);
        this.setState({
            subsystemSelected: subsystem,
            breadcrumbName: newBreadcrumbName
        })
        this.props.onEntityClick(subsystem.id);
    }

    clearSubsystemSelected() {
        this.setState({
            subsystemSelected: null,
            breadcrumbName: ''
        })
    }

    render() {
        return (this.state.subsystemSelected === null ?
            <SubsystemSelector
                tagCount={true}
                urlParams={{ systemId: this.props.system.id }}
                onSubsystemSelected={this.onSubsystemSelected}
                projectId={this.props.projectId}>
            </SubsystemSelector>
            :
            <EquipmentPanel
                system={this.props.system}
                subsystem={this.state.subsystemSelected}
                projectId={this.props.projectId}
                addToBreadcrumbs={this.props.addToBreadcrumbs}
                updateBreadcrumbName={this.props.updateBreadcrumbName}
                onTagClick={this.props.onTagClick}
                selectedTag={this.props.selectedTag}>
            </EquipmentPanel>
        )
    }
}

export default SubsystemPanel;

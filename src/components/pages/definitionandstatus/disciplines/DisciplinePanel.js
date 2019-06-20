import React from 'react';
import DisciplineSelector from '../../../selectors/DisciplineSelector';
import EquipmentPanel from './equipment/EquipmentPanel';

class DisciplinePanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            disciplineSelected: null,
            breadcrumbName: '',
            breadcrumbTitle: 'Discipline'
        }

        this.onDisciplineSelected = this.onDisciplineSelected.bind(this);
        this.clearDisciplineSelected = this.clearDisciplineSelected.bind(this);

        this.props.addToBreadcrumbs({ name: this.state.breadcrumbName, title: this.state.breadcrumbTitle, onClick: this.clearDisciplineSelected });
    }

    onDisciplineSelected(discipline) {
        let newBreadcrumbName = `${discipline.name}`;
        this.props.updateBreadcrumbName(this.state.breadcrumbName, newBreadcrumbName);
        this.setState({
            disciplineSelected: discipline,
            breadcrumbName: newBreadcrumbName
        })
    }

    clearDisciplineSelected() {
        this.setState({
            disciplineSelected: null,
            breadcrumbName: ''
        })
    }

    render() {
        return (this.state.disciplineSelected === null ?
            <DisciplineSelector
                tagCount={true}
                onDisciplineSelected={this.onDisciplineSelected}
                projectId={this.props.projectId}>
            </DisciplineSelector>
            :
            <EquipmentPanel
                discipline={this.state.disciplineSelected}
                projectId={this.props.projectId}
                addToBreadcrumbs={this.props.addToBreadcrumbs}
                updateBreadcrumbName={this.props.updateBreadcrumbName}
                onTagClick={this.props.onTagClick}
                selectedTag={this.props.selectedTag}>
            </EquipmentPanel>
        )
    }
}

export default DisciplinePanel;

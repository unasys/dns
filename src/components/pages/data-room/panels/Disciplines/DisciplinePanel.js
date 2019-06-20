import React from 'react';
import DisciplineSelector from '../../../../selectors/DisciplineSelector';
import DocumentsPanel from './documents/DocumentsPanel';

class DisciplinePanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            disciplineSelected: null,
            breadcrumbName: 'Discipline'
        }

        this.onDisciplineSelected = this.onDisciplineSelected.bind(this);
        this.clearDisciplineSelected = this.clearDisciplineSelected.bind(this);

        this.props.addToBreadcrumbs({ name: this.state.breadcrumbName, onClick: this.clearDisciplineSelected });
    }

    onDisciplineSelected(discipline) {
        let newBreadcrumbName = `Discipline (${discipline.name})`;
        this.props.updateBreadcrumbName(this.state.breadcrumbName, newBreadcrumbName);
        this.setState({
            disciplineSelected: discipline,
            breadcrumbName: newBreadcrumbName
        })
    }

    clearDisciplineSelected() {
        this.setState({
            disciplineSelected: null
        })
    }

    render() {
        return (this.state.disciplineSelected === null ?
            <DisciplineSelector
                docCount={true}
                onDisciplineSelected={this.onDisciplineSelected}
                projectId={this.props.projectId}>
            </DisciplineSelector>
            :
            <DocumentsPanel
                discipline={this.state.disciplineSelected}
                projectId={this.props.projectId}
                selectedDocument={this.props.selectedDocument}
                addToBreadcrumbs={this.props.addToBreadcrumbs}
                updateBreadcrumbName={this.props.updateBreadcrumbName}
                onDocumentClick={this.props.onDocumentClick}
                onEntityClick={this.props.onEntityClick}>
            </DocumentsPanel>
        )
    }
}

export default DisciplinePanel;

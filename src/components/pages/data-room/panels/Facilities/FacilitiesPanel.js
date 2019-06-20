import React from 'react';
import FacilitySelector from '../../../../selectors/FacilitySelector';
import DocumentTypesPanel from './documenttypes/DocumentTypesPanel';
import ModulesPanel from './subsea/modules/ModulesPanel';

class FacilitiesPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            facilitySelected: null,
            breadcrumbName: '',
            breadcrumbTitle: 'Facility'
        }

        this.onFacilitySelected = this.onFacilitySelected.bind(this);
        this.clearFacilitySelected = this.clearFacilitySelected.bind(this);

        this.props.addToBreadcrumbs({ name: this.state.breadcrumbName, title: this.state.breadcrumbTitle, onClick: this.clearFacilitySelected });
    }

    onFacilitySelected(facility) {
        let newBreadcrumbName = `${facility.name}`;
        this.props.updateBreadcrumbName(this.state.breadcrumbName, newBreadcrumbName);
        this.setState({
            facilitySelected: facility,
            breadcrumbName: newBreadcrumbName
        })
        this.props.onEntityClick(facility.id);
    }

    clearFacilitySelected() {
        this.setState({
            facilitySelected: null,
            breadcrumbName: ''
        })
    }

    render() {
        let contentAfterFacility;
        if (this.state.facilitySelected === null) {
            contentAfterFacility =
                <FacilitySelector
                    docCount={true}
                    onFacilitySelected={this.onFacilitySelected}
                    projectId={this.props.projectId}>
                </FacilitySelector>
        } else {
            switch (this.state.facilitySelected.name) {
                case 'Subsea':
                    contentAfterFacility =
                        <ModulesPanel
                            facility={this.state.facilitySelected}
                            projectId={this.props.projectId}
                            addToBreadcrumbs={this.props.addToBreadcrumbs}
                            selectedDocument={this.props.selectedDocument}
                            updateBreadcrumbName={this.props.updateBreadcrumbName}
                            onDocumentClick={this.props.onDocumentClick}
                            selectedTag={this.props.selectedTag}
                            onEntityClick={this.props.onEntityClick}>
                        </ModulesPanel>;
                    break;
                default:
                    contentAfterFacility =
                        <DocumentTypesPanel
                            facility={this.state.facilitySelected}
                            makeWideWidth={this.props.makeWideWidth}
                            projectId={this.props.projectId}
                            selectedDocument={this.props.selectedDocument}
                            addToBreadcrumbs={this.props.addToBreadcrumbs}
                            updateBreadcrumbName={this.props.updateBreadcrumbName}
                            onDocumentClick={this.props.onDocumentClick}
                            onEntityClick={this.props.onEntityClick}>
                        </DocumentTypesPanel>
                    break;
            }
        }


        return contentAfterFacility;
    }
}

export default FacilitiesPanel;

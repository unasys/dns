import React from 'react';
import ProductionUnitsSelector from './ProductionUnitsSelector';
import SystemPanel from '../systems/SystemPanel';

class ProductionUnitsPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            productionUnitSelected: null,
            breadcrumbName: 'Production Unit'
        }

        this.onProductionUnitSelected = this.onProductionUnitSelected.bind(this);
        this.clearProductionUnitSelected = this.clearProductionUnitSelected.bind(this);

        this.props.addToBreadcrumbs({ name: this.state.breadcrumbName, onClick: this.clearProductionUnitSelected });
    }

    onProductionUnitSelected(productionUnit) {
        let newBreadcrumbName = `Production Unit (${productionUnit.name})`;
        this.props.updateBreadcrumbName(this.state.breadcrumbName, newBreadcrumbName);
        this.setState({
            productionUnitSelected: productionUnit,
            breadcrumbName: newBreadcrumbName
        })
        this.props.onEntityClick(productionUnit.id);
    }

    clearProductionUnitSelected() {
        this.setState({
            productionUnitSelected: null
        })
    }

    render() {
        return (this.state.productionUnitSelected === null ?
            <ProductionUnitsSelector
                onProductionUnitSelected={this.onProductionUnitSelected}
                documentType={this.props.documentType}
                projectId={this.props.projectId}>
            </ProductionUnitsSelector>
            :
            <SystemPanel
                productionUnit={this.state.productionUnitSelected}
                documentType={this.props.documentType}
                projectId={this.props.projectId}
                addToBreadcrumbs={this.props.addToBreadcrumbs}
                updateBreadcrumbName={this.props.updateBreadcrumbName}
                onDocumentClick={this.props.onDocumentClick}
                selectedDocument={this.props.selectedDocument}
                onEntityClick={this.props.onEntityClick}>
            </SystemPanel>
        )
    }
}

export default ProductionUnitsPanel;

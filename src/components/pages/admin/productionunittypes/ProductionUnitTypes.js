import React, { Component } from "react";
import ProductionUnitTypesTable from "./ProductionUnitTypesTable";
import './styles/ProductionUnitTypes.scss';
import ActionPanel from "./ActionPanel";

class ProductionUnitTypes extends Component {
    render() {
        return (
            <div className="production-unit-types-grid-container">
                <div className="main-content">
                    <ProductionUnitTypesTable projectId={this.props.projectId}></ProductionUnitTypesTable>
                </div>
                <div className="right-sidebar">
                    <ActionPanel entity="Production Unit Type" projectId={this.props.projectId}></ActionPanel>
                </div>
            </div>
        )
    }
}

export default ProductionUnitTypes;
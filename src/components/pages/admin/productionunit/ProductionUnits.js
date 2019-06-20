import React, { Component } from "react";
import ProductionUnitsTable from "./ProductionUnitsTable";
import './styles/ProductionUnits.scss';
import ActionPanel from "./ActionPanel";

class ProductionUnits extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedProductionUnit: null
        }
        this.selectProductionUnit = this.selectProductionUnit.bind(this);
    }

    selectProductionUnit(PU) {
        this.setState({
            selectedProductionUnit: PU
        })
    }
    render() {
        return (
            <div className="production-units-grid-container">
                <div className="main-content">
                    <ProductionUnitsTable projectId={this.props.projectId} selectProductionUnit={this.selectProductionUnit}></ProductionUnitsTable>
                </div>
                <div className="right-sidebar">
                    <ActionPanel entity="Production Unit" projectId={this.props.projectId} selectedProductionUnit={this.state.selectedProductionUnit}></ActionPanel>
                </div>
            </div>
        )
    }
}

export default ProductionUnits;
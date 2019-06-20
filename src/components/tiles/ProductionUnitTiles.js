import React, { Component } from 'react';
import Tiles from './Tiles';
import './DocumentTypeTile.scss';
import ProductionUnitSelector from '../selectors/tile-selectors/ProductionUnitSelector';
import RenderProductionUnit from './renderers/ProductionUnitTileRenderer';
import RenderProductionUnitCrumbRenderer from './renderers/breadcrumbs/ProductionUnitCrumbRenderer';

class ProductionUnitTiles extends Component {

    constructor(props) {
        super(props);
        this.onTileClick = this.onTileClick.bind(this);
        this.onChevronClick = this.onChevronClick.bind(this);
        this.onHover = this.onHover.bind(this);
        this.flipCard = this.flipCard.bind(this);
        this.state = {
            firstClick: true,
            isBarOpen: false,
            openBarFor: null,
            isCardFlipped: false,
            flippedFor: null
        }
    }

    onTileClick(productionUnit) {
        this.props.addToBreadcrumbs({ object: productionUnit, renderer: RenderProductionUnitCrumbRenderer, returnToIndex: 1, returnToScreenDataDependencies: this.props.screenDataDependencies, nextBreadcrumb:this.props.nextBreadcrumb });
        this.props.onClick({ productionUnit: productionUnit.id });
    }

    onChevronClick(e, productionUnit) {
        e.stopPropagation();
        this.setState({
            isBarOpen: !this.state.isBarOpen,
            openBarFor: productionUnit
        })
    }

    onHover(productionUnit) {
        this.props.setPreviewCrumbContent(productionUnit)
    }

    flipCard(e, productionUnit) {
        e.stopPropagation();
        this.setState({
            isCardFlipped: !this.state.isCardFlipped,
            flippedFor: productionUnit.id
        })
    }


    render() {
        let tiles = (
            <Tiles>
                <ProductionUnitSelector
                    projectId={this.props.projectId}
                    onRender={(productionUnits) => {
                        return productionUnits.map(productionUnit => {
                            let barOpen =
                                (this.state.isBarOpen &&
                                    this.state.openBarFor === productionUnit.id)
                            let isFlipped = 
                                (this.state.isCardFlipped && 
                                    this.state.flippedFor === productionUnit.id)
                            return RenderProductionUnit(productionUnit, this.onTileClick, this.onChevronClick, barOpen, this.onHover, this.flipCard, isFlipped);
                        })
                    }}>
                </ProductionUnitSelector>
            </Tiles>
        )
        return tiles
    }
}

export default ProductionUnitTiles
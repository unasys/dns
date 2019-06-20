import React, { Component } from 'react';
import Tiles from './Tiles';
import './DocumentTypeTile.scss';
import EquipmentTypeSelector from '../selectors/tile-selectors/EquipmentTypeSelector';
import RenderEquipmentType from './renderers/EquipmentTypeTileRenderer';
import RenderEquipmentTypeCrumb from './renderers/breadcrumbs/EquipmentTypeRenderer';

class EquipmentTiles extends Component {

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
        }
    }

    onTileClick(equipmentType) {
        this.props.onEntityClick(equipmentType.id)
        this.props.addToBreadcrumbs({ object: equipmentType, renderer: RenderEquipmentTypeCrumb, returnToIndex: 0, returnToScreenDataDependencies: null, nextBreadcrumb: this.props.nextBreadcrumb });
        this.props.onClick({ equipmentTypeId: equipmentType.id });
        this.props.setPreviewCrumbContent(null)
    }

    onChevronClick(e, equipment) {
        e.stopPropagation();
        this.setState({
            isBarOpen: !this.state.isBarOpen,
            openBarFor: equipment
        })
    }

    onHover(equipment) {
        this.props.setPreviewCrumbContent(equipment)
    }

    flipCard(e, location) {
        e.stopPropagation();
        this.setState({
            isCardFlipped: !this.state.isCardFlipped,
            flippedFor: location.id
        })
    }

    render() {
        let tiles = (
            <Tiles>
                <EquipmentTypeSelector
                    projectId={this.props.projectId}
                    tagCount={this.props.tagCount}
                    onRender={(equipmentTypes) => {
                        return equipmentTypes.map(equipmentType => {
                            let barOpen =
                            (this.state.isBarOpen &&
                                this.state.openBarFor === equipmentType.id)
                            return RenderEquipmentType(equipmentType, this.onTileClick, this.onChevronClick, barOpen, this.onHover);
                        })
                    }}>
                </EquipmentTypeSelector>
            </Tiles>
        )
        return tiles
    }
}

export default EquipmentTiles
import React, { Component } from 'react';
import Tiles from './Tiles';
import './DocumentTypeTile.scss';
import RenderFacility from './renderers/FacilityTileRenderer';
import RenderFacilityCrumb from './renderers/breadcrumbs/FacilityCrumbRenderer';
import FacilitySelector from '../selectors/tile-selectors/FacilitiySelector';

class FacilityTiles extends Component {

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

    onTileClick(facility) {
        this.props.addToBreadcrumbs({ object: facility, renderer: RenderFacilityCrumb, returnToIndex: this.props.returnToIndex, returnToScreenDataDependencies: this.props.screenDataDependencies, nextBreadcrumb: this.props.nextBreadcrumb });
        this.props.onClick({ facilityId: facility.id });
        this.props.setPreviewCrumbContent(null)
    }

    onChevronClick(e, facility) {
        e.stopPropagation();
        this.setState({
            isBarOpen: !this.state.isBarOpen,
            openBarFor: facility
        })
    }

    onHover(discipline) {
        this.props.setPreviewCrumbContent(discipline)
    }

    
    flipCard(e, facility) {
        e.stopPropagation();
        this.setState({
            isCardFlipped: !this.state.isCardFlipped,
            flippedFor: facility.id
        })
    }

    render() {
        let tiles = (
            <Tiles>
                <FacilitySelector
                    projectId={this.props.projectId}
                    docCount={this.props.docCount}
                    tagCount={this.props.tagCount}
                    onRender={(facilities) => {
                        return facilities.map(facility => {
                            let barOpen =
                                (this.state.isBarOpen &&
                                    this.state.openBarFor === facility.id)
                            let isFlipped = 
                                (this.state.isCardFlipped && 
                                    this.state.flippedFor === facility.id)
                            return RenderFacility(facility, this.onTileClick, this.onChevronClick, barOpen, this.onHover, this.flipCard, isFlipped);
                        })
                    }}>
                </FacilitySelector>
            </Tiles>
        )
        return tiles
    }
}

export default FacilityTiles
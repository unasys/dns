import React, { Component } from 'react';
import Tiles from './Tiles';
import './DocumentTypeTile.scss';
import RenderLocation from './renderers/LocationTileRenderer';
import RenderLocationCrumb from './renderers/breadcrumbs/LocationCrumbRenderer';
import LocationSelector from '../selectors/tile-selectors/LocationSelector';

class LocationTiles extends Component {

    constructor(props) {
        super(props);
        this.onTileClick = this.onTileClick.bind(this);
        this.onHover = this.onHover.bind(this);
        this.flipCard = this.flipCard.bind(this);
    }

    onTileClick(location) {
        this.props.addToBreadcrumbs({ object: location, renderer: RenderLocationCrumb, returnToIndex: 3, returnToScreenDataDependencies: this.props.screenDataDependencies, nextBreadcrumb: this.props.nextBreadcrumb });
        this.props.onClick({ location: location });
        this.props.setPreviewCrumbContent(null)
    }

    
    onHover(location) {
        this.props.setPreviewCrumbContent(location)
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
                <LocationSelector
                    projectId={this.props.projectId}
                    urlParams={this.props.screenDataDependencies}
                    docCount={this.props.docCount}
                    tagCount={this.props.tagCount}
                    onRender={(locations) => {
                        return locations.map(location => {
                            return RenderLocation(location, this.onTileClick, this.onHover);
                        })
                    }}>
                </LocationSelector>
            </Tiles>
        )
        return tiles
    }
}

export default LocationTiles
import React, { Component } from 'react';
import Tiles from './Tiles';
import './DocumentTypeTile.scss';
import RenderArea from './renderers/AreaTileRenderer';
import AreaSelector from '../selectors/tile-selectors/AreaSelector';
import RenderAreaCrumb from './renderers/breadcrumbs/AreaCrumbRenderer';

class AreaTiles extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isBarOpen: false,
            openBarFor: null
        }
        this.onTileClick = this.onTileClick.bind(this);
        this.onChevronClick = this.onChevronClick.bind(this);
        this.onHover = this.onHover.bind(this);
    }

    onTileClick(area) {
        this.props.addToBreadcrumbs({ object: area, renderer: RenderAreaCrumb, returnToIndex: 2, returnToScreenDataDependencies: this.props.screenDataDependencies, nextBreadcrumb: this.props.nextBreadcrumb });
        this.props.onClick({ references: area.id });
        this.props.onEntityClick(area.id);
        this.props.setPreviewCrumbContent(null)
    }

    onChevronClick(e, area) {
        e.stopPropagation();
        this.setState({
            isBarOpen: !this.state.isBarOpen,
            openBarFor: area.id
        })
    }

    onHover(discipline) {
        this.props.setPreviewCrumbContent(discipline)
    }

    render() {
        let tiles = (
            <Tiles>
                <AreaSelector
                    projectId={this.props.projectId}
                    urlParams={this.props.screenDataDependencies}
                    docCount={this.props.docCount}
                    tagCount={this.props.tagCount}
                    onRender={(areas) => {
                        return areas.map(area => {
                            let barOpen =
                                (this.state.isBarOpen &&
                                    this.state.openBarFor === area.id)
                            return RenderArea(area, this.onTileClick, this.onChevronClick, barOpen, this.onHover);
                        })
                    }}>
                </AreaSelector>
            </Tiles>
        )
        return tiles
    }
}

export default AreaTiles
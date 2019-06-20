import React, { Component } from 'react';
import Tiles from './Tiles';
import './DocumentTypeTile.scss';
import RenderTags from './renderers/TagTileRenderer';
import TagSelector from '../selectors/tile-selectors/TagSelector';
import RenderTagCrumb from './renderers/breadcrumbs/TagCrumbRenderer';

class TagTiles extends Component {

    constructor(props) {
        super(props);
        this.onTileClick = this.onTileClick.bind(this);
    }

    onTileClick(tag) {
        this.props.onEntityClick(tag.id)
        this.props.addToBreadcrumbs({ object: tag, renderer: RenderTagCrumb, returnToIndex: 0, returnToScreenDataDependencies: null });
        this.props.onClick({ tagId: tag.id });
    }

    render() {
        let tiles = (
            <Tiles>
                <TagSelector
                    projectId={this.props.projectId}
                    onRender={(equipmentTypes) => {
                        return equipmentTypes.map(equipmentType => {
                            return RenderTags(equipmentType, this.onTileClick);
                        })
                    }}>
                </TagSelector>
            </Tiles>
        )
        return tiles
    }
}

export default TagTiles
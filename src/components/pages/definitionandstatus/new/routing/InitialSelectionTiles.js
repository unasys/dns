import React, { Component } from 'react';
import Tiles from '../../../../tiles/Tiles';
import '../../../../tiles/DocumentTypeTile.scss';
import RenderInitialSelection from '../../../../tiles/renderers/RenderInitialSelection';

class InitialSelectionTiles extends Component {

    constructor(props) {
        super(props);
        this.onTileClick = this.onTileClick.bind(this);
        this.state = {
            filterTypes:
                [
                    { id: '1', name: 'Facilities' },
                    { id: '2', name: 'Disciplines' },
                    { id: '3', name: 'Systems' }
                ]
        }
    }

    onTileClick(filterType) {
        this.props.initialTypeSelected(filterType)
    }

    render() {
        let tiles = (
            <Tiles>
                {
                    this.state.filterTypes.map(filterType => {
                        return RenderInitialSelection(filterType, this.onTileClick);
                    })
                }
            </Tiles>
        )
        return tiles
    }
}

export default InitialSelectionTiles
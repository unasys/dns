import React, { Component } from 'react';
import Tiles from './Tiles';
import './DocumentTypeTile.scss';
import DocumentSelector from '../selectors/tile-selectors/DocumentSelector';
import RenderDocumentTile from './renderers/DocumentTileRenderer';

class DocumentTiles extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isBarOpen: false,
            openBarFor: null,
            isCardFlipped: false,
            flippedFor: null
        }
        this.onTileClick = this.onTileClick.bind(this);
        this.onChevronClick = this.onChevronClick.bind(this);
        this.doubleChevronOnClick = this.doubleChevronOnClick.bind(this);
        this.flipCard = this.flipCard.bind(this);
    }

    onTileClick(document) {
        this.props.documentOnClick(document)
    }

    onChevronClick(e, documentId) {
        e.stopPropagation();
        this.setState({
            isBarOpen: !this.state.isBarOpen,
            openBarFor: documentId
        })
    }

    doubleChevronOnClick(e, documentId) {
        e.stopPropagation();
        this.setState({
            isTileExpanded: !this.state.isTileExpanded,
            tileExpandedFor: documentId
        })
    }

    flipCard(e, system) {
        e.stopPropagation();
        this.setState({
            isCardFlipped: !this.state.isCardFlipped,
            flippedFor: system.id
        })
    }

    render() {
        let urlParams = this.props.screenDataDependencies
        let tiles = (
            <Tiles>
                <DocumentSelector
                    projectId={this.props.projectId}
                    urlParams={urlParams}
                    onRender={(documents) => {
                        return documents.map(document => {
                            let barOpen =
                                (this.state.isBarOpen &&
                                    this.state.openBarFor === document.id)

                            let tileExpanded =
                                (this.state.isTileExpanded &&
                                    this.state.tileExpandedFor === document.id)

                            let isFlipped = 
                                (this.state.isCardFlipped && 
                                    this.state.flippedFor === document.id)

                            console.log(tileExpanded);
                            return RenderDocumentTile(document, this.onTileClick, this.onChevronClick, barOpen, this.doubleChevronOnClick, tileExpanded, this.flipCard, isFlipped);
                        })
                    }}>
                </DocumentSelector>
            </Tiles>
        )
        return tiles
    }
}

export default DocumentTiles
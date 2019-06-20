import React, { Component } from 'react';
import Tiles from './Tiles';
import './DocumentTypeTile.scss';
import DocumentTypeSelector from '../selectors/tile-selectors/DocumentTypeSelector';
import RenderDocumentTypeTile from './renderers/DocumentTypeTileRenderer';
import RenderDocumentTypeTileCrumb from './renderers/breadcrumbs/DocumentTypeCrumbRenderer';

class DocumentTypeTiles extends Component {

    constructor(props) {
        super(props);
        this.onTileClick = this.onTileClick.bind(this);
        this.flipCard = this.flipCard.bind(this);
        this.state = {
            isCardFlipped: false,
            flippedFor: null
        }
    }

    onTileClick(documentType) {
        this.props.documentTypeSelected(documentType)
        this.props.addToBreadcrumbs(
            {
                object: documentType,
                renderer: RenderDocumentTypeTileCrumb,
                returnToIndex: 0,
                returnToScreenDataDependencies: null,
                nextBreadcrumb: this.props.nextBreadcrumb
            });
        this.props.onClick({ documentTypeId: documentType.id });
    }

    
    flipCard(e, documentType) {
        e.stopPropagation();
        this.setState({
            isCardFlipped: !this.state.isCardFlipped,
            flippedFor: documentType.id
        })
    }

    render() {
        let tiles = (
            <Tiles>
                <DocumentTypeSelector
                    projectId={this.props.projectId}
                    onRender={(documentTypes) => {
                        return documentTypes.map(documentType => {
                            let isFlipped = 
                            (this.state.isCardFlipped && 
                                this.state.flippedFor === documentType.id)
                            return RenderDocumentTypeTile(documentType, this.onTileClick, this.flipCard, isFlipped);
                        })
                    }}>
                </DocumentTypeSelector>
            </Tiles>
        )
        return tiles
    }
}

export default DocumentTypeTiles
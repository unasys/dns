import React from 'react';
import DocumentGroup from '../../../assets/icons/tiles/DocumentGroup';
import { Flippy, FrontSide, BackSide } from 'react-flippy';

export default function RenderDocumentTypeTile(documentType, onClick, flipCard, isFlipped) {
    let front = (
        <div className="tile" key={documentType.id} onClick={() => onClick(documentType)}>
            <div className="document-type-info">
                <i className="fas fa-sync flip-switch" onClick={(e) => flipCard(e, documentType)}></i>
                <div className="main-tile">
                    <div className="title-panel">
                        <div className="icon">
                        <DocumentGroup size={'85px'}></DocumentGroup>
                        </div>
                        {documentType.name}
                        <div className="details-panel">
                            <div className="name">
                                {documentType.detail && documentType.detail.toLowerCase()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>)
                
        let back = (
            <div className="tile" key={documentType.id} onClick={() => onClick(documentType)}>
                <div className="document-type-info">
                    <i className="fas fa-sync flip-switch" onClick={(e) => flipCard(e, documentType)}></i>
                    {/* <Flip size='15px'></Flip> */}
                    <div className="main-tile-back">
                        <div className="title">
                            {documentType.name}
                        </div>
                        <div className="subtitle">
                            {documentType.detail && documentType.detail.toLowerCase()}
                        </div>
                        <div className="breakdown-item-container">
                            <div className="breakdown-icon">
                                {/* <Document size='15px'></Document> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    
        return (
            <Flippy
            flipDirection="horizontal" 
            isFlipped={isFlipped}>
            <FrontSide>
                {front}
            </FrontSide>
            <BackSide>
            {back}
            </BackSide>
        </Flippy>
        );
}

import React from 'react';
import Chevron from '../../../assets/icons/Chevron';
import { Collapse } from 'react-collapse';
import { getContentForDocument } from '../../../api/Documents';
import Eye from '../../../assets/icons/Eye';
import ExternalLink from '../../../assets/icons/ExternalLink';
import Download from '../../../assets/icons/Download';
import Document from '../../../assets/icons/tiles/Document';
import DoubleChevron from '../../../assets/icons/DoubleChevron';
import Man from '../../../assets/icons/Man';
import Clock from '../../../assets/icons/Clock';
import PenPaper from '../../../assets/icons/PenPaper';
import Modal from '../../pages/admin/modals/Modal';
import { Flippy, FrontSide, BackSide } from 'react-flippy';


function openExternalLink(e, url) {
    e.stopPropagation()
    var newWindow = window.open();
    getContentForDocument(url).then(res => {
        newWindow.location = res.data;
    })
}

// isTileExpanded ?
//     <Modal
//         modalWidth="1000px"
//         content={<img src={require('../../../assets/expanded-tile.png')} alt="completion"></img>}
//         close={e => doubleChevronOnClick(e, document.id)} >
//     </ Modal > : tileContent)

export default function RenderDocumentTile(document, onClick, chevronOnClick, isBarOpen, doubleChevronOnClick, isTileExpanded, flipCard, isFlipped) {
let front = (
    <div className="tile" key={document.id} onClick={() => onClick(document)} >
        <div className="document-type-info">
            <i className="fas fa-sync flip-switch" onClick={(e) => flipCard(e, document)}></i>
            <div className="main-tile">
                <div className="title-panel">
                    <div className="icon">
                    <Document size={'85px'}></Document>
                    </div>
                    {document.name}
                    <div className="details-panel">
                        <div className="name">
                            {document.detail && document.detail.toLowerCase()}
                        </div>
                    </div>
                </div>
            </div>
            <div className="button-bar">
                <div className="action-button">
                    <Eye size="20px"></Eye>
                </div>
                <div className="action-button" onClick={(e) => openExternalLink(e, document.currentRevision.content)}>
                    <ExternalLink size="20px"></ExternalLink>
                </div>
                <div className="action-button">
                    <Download size="20px"></Download>
                </div>
                <div className="action-button">
                    <PenPaper size="20px"></PenPaper>
                </div>
                <div className={"action-button"} onClick={(e) => doubleChevronOnClick(e, document.id)}>
                    <DoubleChevron size="20px"></DoubleChevron>
                </div>
            </div> 
        </div>
    </div>)
            
    let back = (
        <div className="tile" key={document.id} onClick={() => onClick(document)}>
            <div className="document-type-info">
                <i className="fas fa-sync flip-switch" onClick={(e) => flipCard(e, document)}></i>
                {/* <Flip size='15px'></Flip> */}
                <div className="main-tile-back">
                    <div className="title">
                        {document.name}
                    </div>
                    <div className="subtitle">
                        {document.detail && document.detail.toLowerCase()}
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
import React from 'react';
import Chevron from '../../../assets/icons/Chevron';
import Document from '../../../assets/icons/Document';
import { Collapse } from 'react-collapse';
import Man from '../../../assets/icons/Man';
import Equipment from '../../../assets/icons/tiles/Equipment';
import Flippy, { BackSide, FrontSide } from 'react-flippy';

export default function RenderEquipmentType(equipmentType, onClick, onChevronClick, isBarOpen, onHover, flipCard, isFlipped) {
    let front = (
        <div className="tile" key={equipmentType.id} onClick={() => onClick(equipmentType)} onMouseEnter={() => onHover(equipmentType)} onMouseLeave={() => onHover(null)}>
            <div className="document-type-info">
                <i className="fas fa-sync flip-switch" onClick={(e) => flipCard(e, equipmentType)}></i>
                <div className="main-tile">
                    <div className="title-panel">
                        <div className="icon">
                            <Equipment size={'85px'}></Equipment>
                        </div>
                        {equipmentType.name}
                        <div className="details-panel">
                            <div className="name">
                                {equipmentType.detail && equipmentType.detail.toLowerCase()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>)
            
    let back = (
        <div className="tile" key={equipmentType.id} onClick={() => onClick(equipmentType)} onMouseEnter={() => onHover(equipmentType)} onMouseLeave={() => onHover(null)}>
            <div className="document-type-info">
                <i className="fas fa-sync flip-switch" onClick={(e) => flipCard(e, equipmentType)}></i>
                {/* <Flip size='15px'></Flip> */}
                <div className="main-tile-back">
                    <div className="title">
                        {equipmentType.name}
                    </div>
                    <div className="subtitle">
                        {equipmentType.detail && equipmentType.detail.toLowerCase()}
                    </div>
                    <div className="breakdown-item-container">
                        <div className="breakdown-icon">
                            {/* <Document size='15px'></Document> */}
                        </div>
                        <div className="breakdown-item">
                            <div className="breakdown-title">
                                No. of Docs
                            </div>
                            <div className="breakdown-count">
                                124
                            </div>
                        </div>
                        <div className="breakdown-item">
                            <div className="breakdown-title">
                                Received
                            </div>
                            <div className="breakdown-count">
                                85
                            </div>
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
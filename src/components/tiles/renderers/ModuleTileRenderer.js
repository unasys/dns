import React from 'react';
import Chevron from '../../../assets/icons/Chevron';
import Document from '../../../assets/icons/Document';
import Man from '../../../assets/icons/Man';
import Clock from '../../../assets/icons/Clock';
import { Collapse } from 'react-collapse';
import ModuleIcon from '../../../assets/icons/tiles/ModuleIcon';
import { Flippy, FrontSide, BackSide } from 'react-flippy';

export default function RenderModule(moduleObject, onClick, onChevronClick, isBarOpen, onHover, flipCard, isFlipped) {
    let front = (
        <div className="tile" key={moduleObject.id} onClick={() => onClick(moduleObject)} onMouseEnter={() => onHover(moduleObject)} onMouseLeave={() => onHover(null)}>
            <div className="document-type-info">
                <i className="fas fa-sync flip-switch" onClick={(e) => flipCard(e, moduleObject)}></i>
                <div className="main-tile">
                    <div className="title-panel">
                        <div className="icon">
                            <ModuleIcon size={'85px'}></ModuleIcon>
                        </div>
                        {moduleObject.name}
                        <div className="details-panel">
                            <div className="name">
                                {moduleObject.detail.toLowerCase()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>)
                
        let back = (
            <div className="tile" key={moduleObject.id} onClick={() => onClick(moduleObject)} onMouseEnter={() => onHover(moduleObject)} onMouseLeave={() => onHover(null)}>
                <div className="document-type-info">
                    <i className="fas fa-sync flip-switch" onClick={(e) => flipCard(e, moduleObject)}></i>
                    {/* <Flip size='15px'></Flip> */}
                    <div className="main-tile-back">
                        <div className="title">
                            {moduleObject.name}
                        </div>
                        <div className="subtitle">
                            {moduleObject.detail.toLowerCase()}
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


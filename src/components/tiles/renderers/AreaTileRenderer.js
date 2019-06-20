import React from 'react';
import Chevron from '../../../assets/icons/Chevron';
import Document from '../../../assets/icons/Document';
import { Collapse } from 'react-collapse';
import Man from '../../../assets/icons/Man';
import Clock from '../../../assets/icons/Clock';
import Area from '../../../assets/icons/tiles/Areas';

export default function RenderArea(area, onClick, onChevronClick, isBarOpen, onHover, flipCard, isFlipped) {
    let front = (
        <div className="tile" key={area.id} onClick={() => onClick(area)} onMouseEnter={() => onHover(area)} onMouseLeave={() => onHover(null)}>
            <div className="document-type-info">
                <i className="fas fa-sync flip-switch" onClick={(e) => flipCard(e, area)}></i>
                <div className="main-tile">
                    <div className="title-panel">
                        <div className="icon">
                            <Area size='85px'></Area>
                        </div>
                        {area.name}
                        <div className="details-panel">
                            <div className="name">
                                {area.detail.toLowerCase()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>)
                
        let back = (
            <div className="tile" key={area.id} onClick={() => onClick(area)} onMouseEnter={() => onHover(area)} onMouseLeave={() => onHover(null)}>
                <div className="document-type-info">
                    <i className="fas fa-sync flip-switch" onClick={(e) => flipCard(e, area)}></i>
                    {/* <Flip size='15px'></Flip> */}
                    <div className="main-tile-back">
                        <div className="title">
                            {area.name}
                        </div>
                        <div className="subtitle">
                            {area.detail.toLowerCase()}
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
            isFlipped ? back : front
        );
    }
    
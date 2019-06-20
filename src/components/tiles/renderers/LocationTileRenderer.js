import React from 'react';
import Chevron from '../../../assets/icons/Chevron';
import Location from '../../../assets/icons/tiles/Location';
import { Flippy, FrontSide, BackSide } from 'react-flippy';

export default function RenderLocation(location, onClick, onHover, flipCard, isFlipped) {
    let front = (
        <div className="tile" key={location.id} onClick={() => onClick(location)} onMouseEnter={() => onHover(location)} onMouseLeave={() => onHover(null)}>
            <div className="document-type-info">
                <i className="fas fa-sync flip-switch" onClick={(e) => flipCard(e, location)}></i>
                <div className="main-tile">
                    <div className="title-panel">
                        <div className="icon">
                            <Location size={'75px'}></Location>
                        </div>
                        {location.name}
                        <div className="details-panel">
                            <div className="name">
                                {location.detail && location.detail.toLowerCase()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>)
                
        let back = (
            <div className="tile" key={location.id} onClick={() => onClick(location)} onMouseEnter={() => onHover(location)} onMouseLeave={() => onHover(null)}>
                <div className="document-type-info">
                    <i className="fas fa-sync flip-switch" onClick={(e) => flipCard(e, location)}></i>
                    {/* <Flip size='15px'></Flip> */}
                    <div className="main-tile-back">
                        <div className="title">
                            {location.name}
                        </div>
                        <div className="subtitle">
                            {location.detail && location.detail.toLowerCase()}
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
        )
}
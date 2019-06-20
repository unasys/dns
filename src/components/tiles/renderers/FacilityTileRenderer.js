import React from 'react';
import Chevron from '../../../assets/icons/Chevron';
import Document from '../../../assets/icons/Document';
import Man from '../../../assets/icons/Man';
import Clock from '../../../assets/icons/Clock';
import { Collapse } from 'react-collapse';
import Flippy, { BackSide, FrontSide } from 'react-flippy';
import Facility from '../../../assets/icons/tiles/Facility';

export default function RenderFacility(facility, onClick, chevronOnClick, isBarOpen, onHover, flipCard, isFlipped) {
    let numberOfSystems = facility.systemCount

    let front = (
        <div className="tile" key={facility.id} onClick={() => onClick(facility)} onMouseEnter={() => onHover(facility)} onMouseLeave={() => onHover(null)}>
            <div className="document-type-info">
                <i className="fas fa-sync flip-switch" onClick={(e) => flipCard(e, facility)}></i>
                <div className="main-tile">
                    <div className="title-panel">
                        <div className="icon">
                            <Facility size={'85px'}></Facility>
                        </div>
                        {facility.name}
                        <div className="details-panel">
                            <div className="name">
                                {facility.detail && facility.detail.toLowerCase()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>)
            
    let back = (
        <div className="tile" key={facility.id} onClick={() => onClick(facility)} onMouseEnter={() => onHover(facility)} onMouseLeave={() => onHover(null)}>
            <div className="document-type-info">
                <i className="fas fa-sync flip-switch" onClick={(e) => flipCard(e, facility)}></i>
                {/* <Flip size='15px'></Flip> */}
                <div className="main-tile-back">
                    <div className="title">
                        {facility.name}
                    </div>
                    <div className="subtitle">
                        {facility.detail && facility.detail.toLowerCase()}
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
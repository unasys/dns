import React from 'react';
import Chevron from '../../../assets/icons/Chevron';
import Document from '../../../assets/icons/Document';
import Man from '../../../assets/icons/Man';
import Clock from '../../../assets/icons/Clock';
import { Collapse } from 'react-collapse';
import ProductionUnit from '../../../assets/icons/tiles/ProductionUnit';
import { Flippy, FrontSide, BackSide } from 'react-flippy';


export default function RenderProductionUnit(productionUnit, onClick, chevronOnClick, isBarOpen, onHover, flipCard, isFlipped) {
    let numberOfSystems = productionUnit.systemCount
    let front = (
        <div className="tile" key={productionUnit.id} onClick={() => onClick(productionUnit)} onMouseEnter={() => onHover(productionUnit)} onMouseLeave={() => onHover(null)}>
            <div className="document-type-info">
                <i className="fas fa-sync flip-switch" onClick={(e) => flipCard(e, productionUnit)}></i>
                <div className="main-tile">
                    <div className="title-panel">
                        <div className="icon">
                        <ProductionUnit size='85px'></ProductionUnit>
                        </div>
                        {productionUnit.name}
                        <div className="details-panel">
                            <div className="name">
                                {productionUnit.detail.toLowerCase()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>)
                
        let back = (
            <div className="tile" key={productionUnit.id} onClick={() => onClick(productionUnit)} onMouseEnter={() => onHover(productionUnit)} onMouseLeave={() => onHover(null)}>
                <div className="document-type-info">
                    <i className="fas fa-sync flip-switch" onClick={(e) => flipCard(e, productionUnit)}></i>
                    {/* <Flip size='15px'></Flip> */}
                    <div className="main-tile-back">
                        <div className="title">
                            {productionUnit.name}
                        </div>
                        <div className="subtitle">
                            {productionUnit.detail && productionUnit.detail.toLowerCase()}
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
    /* {numberOfSystems !== undefined && ("Number of systems " + numberOfSystems)} */
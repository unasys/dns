import React from 'react';
import Chevron from '../../../assets/icons/Chevron';
import Document from '../../../assets/icons/Document';
import Man from '../../../assets/icons/Man';
import Disciplines from '../../../assets/icons/tiles/Disciplines';
import { Collapse } from 'react-collapse';
import Flippy, { BackSide, FrontSide } from 'react-flippy';

export default function RenderDiscipline(discipline, onClick, onChevronClick, isBarOpen, onHover, flipCard, isFlipped) {
    let front = (
        <div className="tile" key={discipline.id} onClick={() => onClick(discipline)} onMouseEnter={() => onHover(discipline)} onMouseLeave={() => onHover(null)}>
            <div className="document-type-info">
                <i className="fas fa-sync flip-switch" onClick={(e) => flipCard(e, discipline)}></i>
                <div className="main-tile">
                    <div className="title-panel">
                        <div className="icon">
                            <Disciplines size={'85px'}></Disciplines>
                        </div>
                        {discipline.name}
                        <div className="details-panel">
                            <div className="name">
                                {discipline.detail && discipline.detail.toLowerCase()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>)
            
    let back = (
        <div className="tile" key={discipline.id} onClick={() => onClick(discipline)} onMouseEnter={() => onHover(discipline)} onMouseLeave={() => onHover(null)}>
            <div className="document-type-info">
                <i className="fas fa-sync flip-switch" onClick={(e) => flipCard(e, discipline)}></i>
                {/* <Flip size='15px'></Flip> */}
                <div className="main-tile-back">
                    <div className="title">
                        {discipline.name}
                    </div>
                    <div className="subtitle">
                        {discipline.detail && discipline.detail.toLowerCase()}
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


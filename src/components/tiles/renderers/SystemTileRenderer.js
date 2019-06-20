import React from 'react';
import StatusOperational from '../../result-item/status-icons/status-operational';
import StatusDecommissioned from '../../result-item/status-icons/status-decommissioned';
import StatusPassive from '../../result-item/status-icons/status-passive';
import StatusRedundant from '../../result-item/status-icons/status-redundant';
import StatusRemoved from '../../result-item/status-icons/status-removed';
import StatusShutdown from '../../result-item/status-icons/status-shutdown';
import System from '../../../assets/icons/System';
import Document from '../../../assets/icons/Document';
import Flip from '../../../assets/icons/Flip';
import Flippy, { BackSide, FrontSide } from 'react-flippy';

function getStatusIcon(status, condition) {
    switch (status.toLowerCase()) {
        case "operational":
            return <StatusOperational condition={condition} />;
        case "decommissioned":
            return <StatusDecommissioned />;
        case "passive":
            return <StatusPassive />;
        case "redundant":
            return <StatusRedundant />;
        case "removed":
            return <StatusRemoved />;
        case "shutdown":
            return <StatusShutdown />;
        default:
            return null;
    }
}

export default function RenderSystemTile(system, onClick, onActivityClick, chevronOnClick, isBarOpen, onHover, flipCard, isFlipped) {

    let numberOfActivities = (system.name === "GB.EIA.A01" && "Number of Activities 1")

    let front = (
        <div className="tile" key={system.id} onClick={() => onClick(system)} onMouseEnter={() => onHover(system)} onMouseLeave={() => onHover(null)}>
            <div className="document-type-info">
                <i className="fas fa-sync flip-switch" onClick={(e) => flipCard(e, system)}></i>
                <div className="main-tile">
                    <div className="title-panel">
                        <div className="icon">
                        <System size='85px'></System>
                        </div>
                        {"System " + system.name}
                        <div className="details-panel">
                            <div className="name">
                                {system.detail.toLowerCase()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>)
            
    let back = (
        <div className="tile" key={system.id} onClick={() => onClick(system)} onMouseEnter={() => onHover(system)} onMouseLeave={() => onHover(null)}>
            <div className="document-type-info">
                <i className="fas fa-sync flip-switch" onClick={(e) => flipCard(e, system)}></i>
                {/* <Flip size='15px'></Flip> */}
                <div className="main-tile-back">
                    <div className="title">
                        {system.name}
                    </div>
                    <div className="subtitle">
                        {system.detail.toLowerCase()}
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
                                {system.count}
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





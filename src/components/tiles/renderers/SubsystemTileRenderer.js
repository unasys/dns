import React from 'react';
import Chevron from '../../../assets/icons/Chevron';
import Document from '../../../assets/icons/Document';
import Man from '../../../assets/icons/Man';
import Clock from '../../../assets/icons/Clock';
import { Collapse } from 'react-collapse';

export default function RenderSubsystem(Subsystem, onClick, onChevronClick, isBarOpen, onHover) {
    return (<div className="tile" key={Subsystem.id} onClick={() => onClick(Subsystem)} onMouseEnter={() => onHover(Subsystem)} onMouseLeave={() => onHover(null)}>
        <div className="document-type-info">
            <div className="header">
                <div className="tile-information">
                    <div className="entity-type">
                        {Subsystem.name}
                    </div>

                    <div className="chevron" onClick={(e) => onChevronClick(e, Subsystem)}>
                        <Chevron size="20px"></Chevron>
                    </div>
                </div>
            </div>
            <div className="main-tile">
                <div className="title-panel">
                    <div className="details-panel">
                        <div className="name">
                            {Subsystem.detail}
                        </div>
                    </div>
                    <div className="icon-count">
                        <div className="">
                            <Document size="40px" number={Subsystem.count}></Document>
                        </div>
                    </div>
                </div>
                <Collapse isOpened={isBarOpen}>
                    <div className="last-modi">
                        <div className="last-modified-title">
                            Last Modified
                            </div>
                        <div className="updated-row">
                            <div className="last-modified-labels"><Man size="20px"></Man>Tony Williams</div>
                            <div className="last-modified-labels"><Clock size="20px"></Clock>{Subsystem.lastModified.slice(0, 10)}</div>
                        </div>
                    </div>
                </Collapse>
            </div>
        </div>
    </div >)
}


import React from 'react';
import Chevron from '../../../assets/icons/Chevron';
import Document from '../../../assets/icons/Document';
import { Collapse } from 'react-collapse';
import Man from '../../../assets/icons/Man';
import Clock from '../../../assets/icons/Clock';

export default function RenderTag(tag, onClick, onChevronClick, isBarOpen) {
    return (<div className="tile" key={tag.id} onClick={() => onClick(tag)}>
        <div className="document-type-info">
            <div className="header">
                <div className="tile-information">
                    <div className="entity-type">
                        {tag.name}
                    </div>

                    <div className="chevron" onClick={(e) => onChevronClick(e, tag)}>
                        <Chevron size="20px"></Chevron>
                    </div>
                </div>
            </div>
            <div className="main-tile">
                <div className="title-panel">
                    <div className="details-panel">
                        <div className="name">
                            {tag.detail}
                        </div>
                    </div>
                    <div className="icon-count">
                        <div className="">
                            <Document size="40px" number={tag.count}></Document>
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
                            <div className="last-modified-labels"><Clock size="20px"></Clock>{document.lastModified.slice(0, 10)}</div>
                        </div>
                    </div>
                </Collapse>

            </div>
        </div>
    </div >)
}
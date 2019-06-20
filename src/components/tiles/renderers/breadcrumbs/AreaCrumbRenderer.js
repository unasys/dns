import React from 'react';
import './TileBreadcrumb.scss';

export default function RenderAreaCrumb(area, onClick, selected) {
    return (
        <div className={selected ? "tilecrumb-container selected" : "tilecrumb-container"} onClick={onClick}>
            <div className="crumb-title">
                <div className="circle">
                </div>
                <div className="crumb-title">
                    Area
                </div>
            </div>
            <div className="crumb-content">
                <div className="first-subheading">
                    {area.name}
                </div>
            </div>
        </div>
    );
}
import React from 'react';
import './TileBreadcrumb.scss';

export default function RenderLocationCrumb(location, onClick, selected) {
    return (
        <div className={selected ? "tilecrumb-container selected" : "tilecrumb-container"} onClick={onClick}>
            <div className="crumb-title">
                <div className="circle">
                </div>
                <div className="crumb-title">
                    Location
                </div>
            </div>
            <div className="crumb-content">
                <div className="first-subheading">
                    {location.name}
                </div>
            </div>
        </div>
    );
}
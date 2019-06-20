import React from 'react';
import './TileBreadcrumb.scss';

export default function RenderFacilityCrumb(facility, onClick, selected) {
    return (
        <div className={selected ? "tilecrumb-container selected" : "tilecrumb-container"} onClick={onClick}>
            <div className="crumb-title">
                <div className="circle">
                </div>
                <div className="crumb-title">
                    Facility
                </div>
            </div>
            <div className="crumb-content">
                <div className="first-subheading">
                    {facility.name}
                </div>
            </div>
        </div>
    );
}
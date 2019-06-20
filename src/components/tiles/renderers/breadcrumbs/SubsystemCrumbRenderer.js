import React from 'react';
import './TileBreadcrumb.scss';

export default function RenderSubsystemCrumbRenderer(subsystem, onClick, selected) {
    return (
        <div className={selected ? "tilecrumb-container selected" : "tilecrumb-container"} onClick={onClick}>
            <div className="crumb-title">
                <div className="circle">
                </div>
                <div className="crumb-title">
                    Subsystem
                </div>
            </div>
            <div className="crumb-content">
                <div className="first-subheading">
                    {subsystem.name}
                </div>
            </div>
        </div>
    );
}
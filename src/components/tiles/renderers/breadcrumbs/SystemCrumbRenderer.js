import React from 'react';
import './TileBreadcrumb.scss';

export default function RenderSystemCrumbRenderer(system, onClick, selected) {
    return (
        <div className={selected ? "tilecrumb-container selected" : "tilecrumb-container"} onClick={onClick}>
            <div className="crumb-title">
                <div className="circle">
                </div>
                <div className="crumb-title">
                    System
                </div>
            </div>
            <div className="crumb-content">
                <div className="first-subheading">
                    {system.name}
                </div>
                <div className="second-subheading">
                    {system.detail}
                </div>
            </div>
        </div>
    );
}
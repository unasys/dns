import React from 'react';
import './TileBreadcrumb.scss';

export default function RenderModuleCrumb(moduleObject, onClick, selected) {
    return (
        <div className={selected ? "tilecrumb-container selected" : "tilecrumb-container"} onClick={onClick}>
            <div className="crumb-title">
                <div className="circle">
                </div>
                <div className="crumb-title">
                    Module
                </div>
            </div>
            <div className="crumb-content">
                <div className="first-subheading">
                    {moduleObject.name}
                </div>
                {moduleObject.detail &&
                    <div className="second-subheading">
                        {moduleObject.detail}
                    </div>}
            </div>
        </div>
    );
}
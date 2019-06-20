import React from 'react';
import './TileBreadcrumb.scss';

export default function RenderTagCrumb(tag, onClick, selected) {
    return (
        <div className={selected ? "tilecrumb-container selected" : "tilecrumb-container"} onClick={onClick}>
            <div className="crumb-title">
                <div className="circle">
                </div>
                <div className="crumb-title">
                    Tag
                </div>
            </div>
            <div className="crumb-content">
                <div className="first-subheading">
                    {tag.name}
                </div>
            </div>
        </div>
    );
}
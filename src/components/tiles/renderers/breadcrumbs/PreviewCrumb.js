import React from 'react';
import './TileBreadcrumb.scss';

export default function RenderBreadcrumbPreview(previewObject, onClick, hoveredContent) {
    console.log(hoveredContent)
    return (
        <div className={"tilecrumb-container preview"} onClick={onClick}>
            <div className="crumb-title">
                <div className="circle">
                </div>
                <div className="crumb-title">
                    {previewObject.name}
                </div>
            </div>
            <div className="crumb-content">
                <div className="first-subheading">
                    {hoveredContent && hoveredContent.name}
                </div>
            </div>
        </div>
    );
}
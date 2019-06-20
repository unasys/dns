import React from 'react';
import './TileBreadcrumb.scss';

export default function RenderDocumentTypeTileCrumb(documentType, onClick, selected) {
    return (
        <div className={selected ? "tilecrumb-container selected" : "tilecrumb-container"} onClick={onClick}>
            <div className="crumb-title">
                <div className="circle">
                </div>
                <div className="crumb-title">
                    Document Type
                </div>
            </div>
            <div className="crumb-content">
                <div className="first-subheading">
                    {documentType.name}
                </div>
            </div>
        </div>
    );
}
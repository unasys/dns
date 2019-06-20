import React from 'react';
import './TileBreadcrumb.scss';

export default function RenderEquipmentTypeCrumb(equipment, onClick, selected) {
    return (
        <div className={selected ? "tilecrumb-container selected" : "tilecrumb-container"} onClick={onClick}>
            <div className="crumb-title">
                <div className="circle">
                </div>
                <div className="crumb-title">
                    Equipment
                </div>
            </div>
            <div className="crumb-content">
                <div className="first-subheading">
                    {equipment.name}
                </div>
            </div>
        </div>
    );
}
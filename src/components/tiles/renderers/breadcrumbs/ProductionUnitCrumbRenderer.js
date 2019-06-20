import React from 'react';
import './TileBreadcrumb.scss';

export default function RenderProductionUnitCrumbRenderer(productionUnit, onClick, selected) {
    let numberOfSystems = productionUnit.systemCount
    return (
        <div className={selected ? "tilecrumb-container selected" : "tilecrumb-container"} onClick={onClick}>
            <div className="crumb-title">
                <div className="circle">
                </div>
                <div className="crumb-title">
                    Production Unit
                </div>
            </div>
            <div className="crumb-content">
                <div className="first-subheading">
                    {productionUnit.name}
                </div>
                <div className="second-subheading">
                    {productionUnit.detail}
                </div>
                <div className="third-subheading">
                    {numberOfSystems !== undefined && ("Number of systems " + numberOfSystems)}
                </div>
            </div>
        </div>
    );
}
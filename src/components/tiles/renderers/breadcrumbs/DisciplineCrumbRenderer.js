import React from 'react';
import './TileBreadcrumb.scss';

export default function RenderDisciplineCrumb(discipline, onClick, selected) {
    return (
        <div className={selected ? "tilecrumb-container selected" : "tilecrumb-container"} onClick={onClick}>
            <div className="crumb-title">
                <div className="circle">
                </div>
                <div className="crumb-title">
                    Discipline
                </div>
            </div>
            <div className="crumb-content">
                <div className="first-subheading">
                    {discipline.name}
                </div>
            </div>
        </div>
    );
}
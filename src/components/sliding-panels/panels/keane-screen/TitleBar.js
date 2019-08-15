import "./TitleBar.scss";
import React from 'react';

function TitleBar(props) {
    return (
        <div className="title-bar-container">
            <div className="keane-title-container">
                <div className="main-title">
                    {props.title}
                </div>
                <div className="keane-subtitle">
                    {props.subtitle}
                </div>
            </div>
            <div className="title-bar-icons">
                {props.installationtype}
            </div>
        </div>
    )
}

export default TitleBar;
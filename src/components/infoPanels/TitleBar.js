import "./TitleBar.scss";
import React from 'react';

function TitleBar(props) {
    return (
        <div className="title-bar-container">
            <div className="titles">
                <div className="main-title">
                    {props.title}
                </div>
                <div className="main-subtitle">
                    {props.subtitle}
                </div>
                <div>
                {props.epm && <img className="project-icon" src="/project.svg" alt="epm" onClick={() => window.open(`https://epm.unasys.com/projects/${props.epm}/`, "_blank")} />}
                </div>
            </div>
            {props.image && <img className="installation-image" src={`https://assets.digitalnorthsea.com/images/installations/${props.image}`} alt="overview-thumbnail" />}
        </div>
    )
}

export default TitleBar;
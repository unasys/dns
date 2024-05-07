import "./TitleBar.scss";
import React from 'react';

function TitleBar(props) {
    if (props.title === "CASTOR UGS PUQ" || props.title === "CASTOR UGS WHP")
    {
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
                {props.image && <a href="https://epm.unasys.com/projects/39660b8f-671b-4116-aea2-72b0b233c7ff/model/e6e77f4a82374c0ea845efa268f69af8" target="_blank"><img className="installation-image" src={`https://assets.digitalnorthsea.com/images/installations/${props.image}`} alt="overview-thumbnail" /></a>}
            </div>
        )
    }

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
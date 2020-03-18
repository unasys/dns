import "./EntryContainer.scss";
import React from 'react';
import { Link } from "react-router-dom";

function EntryContainer(props) {
    let content = null;
    switch (props.type) {
        case "url":
            content = <a target="_blank" rel="noopener noreferrer" href={props.subtitle}>{props.subtitle}</a>
            break;
        case "link":
            content = <Link to={props.link}>{props.subtitle}</Link>
            break;
        default:
            content = props.subtitle;
            break;
    }


    return (
        <details open={props.open ?? true}>
            <summary>
                <div className="summary-title">
                    {props.title}
                </div>
                <div className="summary-subtitle">
                    {content}
                </div>
            </summary>
            <div className="entry-container">
                {props.children}
            </div>
        </details>
    )
}

export default EntryContainer;
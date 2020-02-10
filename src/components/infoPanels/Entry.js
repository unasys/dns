import "./Entry.scss";
import React from 'react';

function Entry(props) {
    let content = null;
    switch (props.type) {
        case "url":
            content = <a target="_blank" rel="noopener noreferrer" href={props.subtitle}>{props.subtitle}</a>
            break;
        default:
            content = props.subtitle;
            break;
    }
    return (
        <div className="entry">
            {props.icon &&
                <div className="entry-icon">
                    {props.icon}
                </div>}
            <div className="entry-content">
                <strong className="entry-title">
                    {props.title}
                </strong>
                <div className="entry-subtitle">
                    {content}
                </div>
            </div>
        </div>
    )
}

export default Entry;
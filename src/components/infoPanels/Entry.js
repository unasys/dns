import "./Entry.scss";
import React from 'react';
import { Link } from "react-router-dom";

function Entry(props) {
    let content = null;
    if (Array.isArray(props.subtitle)) {
        content = props.subtitle.map(v => <Entry key={v.name} title={v.name} subtitle={v.values ?? v.value} type={v.type} borderBottom />);
    } else {
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
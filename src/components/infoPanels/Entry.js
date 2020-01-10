import "./Entry.scss";
import React from 'react';

function Entry(props) {
    return (
        <div className="entry">
            {props.icon &&
                <div className="entry-icon">
                    {props.icon}
                </div>}
            <div className="entry-content">
                <div className="entry-title">
                    {props.title}
                </div>
                <div className="entry-subtitle">
                    {props.subtitle}
                </div>
            </div>
        </div>
    )
}

export default Entry;
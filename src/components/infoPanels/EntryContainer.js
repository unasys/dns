import "./EntryContainer.scss";
import React from 'react';

function EntryContainer(props) {
    return (
        <details open={props.open ?? true}>
            <summary>
                <div className="summary-title">
                    {props.title}
                </div>
                <div className="summary-subtitle">
                    {props.subtitle}
                </div>
            </summary>
            <div className="entry-container">
                {props.children}
            </div>
        </details>
    )
}

export default EntryContainer;
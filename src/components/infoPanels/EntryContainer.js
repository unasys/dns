import "./EntryContainer.scss";
import React from 'react';

function EntryContainer(props) {
    return (
        <details open={props.open??true}>
            <summary>
                {props.title}
            </summary>
            <div className="entry-container">
                {props.children}
            </div>
        </details>
    )
}

export default EntryContainer;
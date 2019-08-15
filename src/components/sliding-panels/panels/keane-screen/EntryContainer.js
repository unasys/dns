import "./EntryContainer.scss";
import React from 'react';

function EntryContainer(props) {
    let classes;
    classes += (props.borderTop ? " solid-border-top" : "");
    classes += (props.borderBottom ? " solid-border-bottom" : "");
    return (
        <div className={"double-width-entry-container " + classes}>
            {props.children}
        </div>
    )
}

export default EntryContainer;
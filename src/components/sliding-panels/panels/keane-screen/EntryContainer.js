import "./EntryContainer.scss";
import React from 'react';
import TitleBar from "./TitleBar";

function EntryContainer(props) {
    let classes;
    classes += (props.borderTop ? " solid-border-top" : "");
    classes += (props.borderBottom ? " solid-border-bottom" : "");
    return (
        <>
        {props.title && <TitleBar title={props.title }/>}

        <div className={"double-width-entry-container " + classes}>
            {props.children}
        </div>
        </>
    )
}

export default EntryContainer;
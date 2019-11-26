import "./Entry.scss"; 
import React from 'react'; 

function Entry(props) {
    return (
        <div className={"entry " + (props.borderBottom && "dotted-border-bottom")}>
        {props.icon && 
        <div className="entry-icon">
            {props.icon}
        </div>}
        <div className="entry-container">
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
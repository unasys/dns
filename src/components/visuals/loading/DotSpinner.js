import React from 'react';
import './DotSpinner.scss';

function DotSpinner(props){
    let style = { height: props.size, width: props.size }
    return (
        <div className="loading-container">
            <div className="dot-spinner" style={style}></div>
            <div className="loading-text">Loading...</div>
        </div>
    )
 }

 export default DotSpinner;
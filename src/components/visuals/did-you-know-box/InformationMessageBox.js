import React from 'react';
import './InformationMessageBox.scss';

function InformationMessageBox(props) {
    return (
        <div className="information-box-container">
            <div className="information-box" onClick={props.clearMessage}>
                {props.message}
            </div>
        </div>
    )
}

export default InformationMessageBox;
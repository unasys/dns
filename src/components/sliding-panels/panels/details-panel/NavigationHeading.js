import React from 'react';


function NavigationHeading(props) {
    return (
        <div className="overview-container" onClick={props.onClick} style={{ cursor: 'pointer' }}>
            <div className="overview-heading">
                {props.heading}
            </div>
            <div className="dropdown-icon">
                <i className="fas fa-chevron-right icon"></i>
            </div>
        </div>
    );
}

export default NavigationHeading;
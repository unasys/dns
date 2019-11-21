import React from 'react';
import {Link} from 'react-router-dom';

function NavigationHeading(props) {
    return (
        <Link className="overview-container" to={props.url}>
            <div className="overview-heading">
                {props.heading}
            </div>
            <div className="dropdown-icon">
                <i className="fas fa-chevron-right icon"></i>
            </div>
        </Link>
    );
}

export default NavigationHeading;
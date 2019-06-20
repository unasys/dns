import React, { Component } from 'react';
import './user-feedback.scss';

class Created extends Component {
    render() {
        return (
            <div className="feedback-icon">
                <i className="fas fa-check"></i>
                <div className="feedback-message">{this.props.entityName + ' created.'}</div>
            </div>
        )
    }
}

export default Created
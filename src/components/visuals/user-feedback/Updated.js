import React, { Component } from 'react';
import './user-feedback.scss';

class Updated extends Component {
    render() {
        return (
            <div className="feedback-icon">
                <i className="fas fa-pencil-alt"></i>
                <div className="feedback-message">{this.props.entityName + ' updated.'}</div>
            </div>
        )
    }
}

export default Updated
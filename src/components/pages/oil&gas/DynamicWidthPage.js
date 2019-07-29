import React, { Component } from 'react';
import './DynamicWidthPage.scss';

class DynamicWidthPage extends Component {
    render() {
        return (
            <div className="dynamic-width-page-container" style={{background: this.props.backgroundColor}}>
                {this.props.children}
            </div>
        );
    }
}

export default DynamicWidthPage;
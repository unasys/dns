import React, { Component } from 'react';
import './Page.scss';

class Page extends Component {
    render() {
        return (
            <div className="page-container">
                {this.props.children}
            </div>
        );
    }
}

export default Page;
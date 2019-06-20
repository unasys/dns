import React, { Component } from 'react';
import './Breadcrumbs.scss';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class Breadcrumbs extends Component {

    onCrumbClick(crumb, index) {
        if (this.props.onCrumbClickHook) {
            this.props.onCrumbClickHook();
        }
        this.props.removeCrumbs(index)
        crumb.onClick();
    }

    render() {
        return (
            <>
                <div className="breadcrumb-container">
                    <ReactCSSTransitionGroup
                        transitionName="fade"
                        style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}
                        transitionEnterTimeout={500}
                        transitionLeaveTimeout={300}>
                        {this.props.crumbs.map((crumb, index) => {
                            return (
                                <div
                                    className="crumb"
                                    onClick={() => this.onCrumbClick(crumb, index)}
                                    key={index}>
                                    <div className="crumb-container">
                                        <div className="crumb-description">
                                            <div className="crumb-title">{crumb.title}</div>
                                            <div className="crumb-name">{crumb.name}</div>
                                        </div>
                                        <i className="fas fa-chevron-right" />
                                    </div>
                                </div>);
                        })}
                    </ReactCSSTransitionGroup>
                </div>
                {this.props.children}
            </>
        );
    }
}

export default Breadcrumbs;
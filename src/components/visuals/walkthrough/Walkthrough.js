/* eslint-disable no-undef */
import React from 'react';
import Draggable from 'react-draggable';
import { connect } from 'react-redux';
import './Walkthrough.scss';

class Walkthrough extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            walkthroughMinimised: false
        };
        this.toggleMinimised = this.toggleMinimised.bind(this);
    }

    toggleMinimised() {
        this.setState({ walkthroughMinimised: !this.state.walkthroughMinimised });
    }

    render() {
        let controlButtons = (<div className="popup-control-buttons">
            <div className="swap-button" onClick={this.props.onSwap}><i className="fas fa-exchange-alt"></i></div>
            <div className="close-button" onClick={this.props.closeWalkthrough}><i className="fas fa-times"></i></div>
        </div>)

        if (this.props.walkthroughSrc === null || this.props.walkthroughSrc === '') {
            return <span></span>;
        }

        return (
            <Draggable>
                <div className={'walkthrough-container ' + (this.props.isPopup ? 'popup' : '') + (this.state.walkthroughMinimised ? 'click-through' : '')}>
                    {this.props.isPopup &&
                        controlButtons}
                    {!this.state.walkthroughMinimised && <iframe ref={this.setIframeRef} className={this.props.isPopup ? "walkthrough-frame" : "walkthrough-frame-fullscreen"} title="walkthrough-viewer" src={this.props.walkthroughSrc}></iframe>}
                </div>
            </Draggable>)
    }
}

function mapStateToProps(state) {
    let walkthroughSrc = state.WalkthroughReducer.walkthroughSrc
    return {
        walkthroughSrc: walkthroughSrc
    }
}

export default connect(mapStateToProps)(Walkthrough)

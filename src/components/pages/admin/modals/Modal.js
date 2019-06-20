import React, { Component } from 'react';

class Modal extends Component {
    render() {
        return (
            <div className="modal is-active">
                <div className="modal-background" onClick={this.props.close}></div>
                <div className="modal-content" style={{ width: this.props.modalWidth }}>
                    {this.props.content}
                </div>
                <button className="modal-close is-large" aria-label="close"></button>
            </div>
        )
    }
}

export default Modal;
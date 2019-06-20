import React from 'react';
import './Handle.scss';

class Handle extends React.Component {
    constructor(props) {
        super(props);
        this.handleClicked = this.handleClicked.bind(this);
        this.state = {
            handleFacingLeft: this.props.isFacingLeft
        }
    }

    handleClicked() {
        this.props.onHandleClick();
        this.toggleHandleFace();
    }

    toggleHandleFace() {
        this.setState(prevState => ({
            handleFacingLeft: !prevState.handleFacingLeft
        }));
    }

    render() {
        return (
            <div className={'handle ' + (this.props.isFacingLeft ? 'left' : 'right')} onClick={this.handleClicked}>
                { this.state.handleFacingLeft ? <i className="fas fa-caret-left"></i> : <i className="fas fa-caret-right"></i> }
            </div>
        )
    }
}

export default Handle;
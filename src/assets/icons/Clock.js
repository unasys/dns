import React, { Component } from 'react';

class Clock extends Component {
    render() {
        return (<svg id="Layer_1" style={{ height: this.props.size, width: this.props.size }} data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10.75 10.75"><title>clock</title><circle cx="5.37" cy="5.37" r="5.12" fill="none" stroke="#303031" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" /><polyline points="5.37 1.38 5.37 5.37 3.11 5.37" fill="none" stroke="#303031" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" /></svg>)
    }
}

export default Clock;
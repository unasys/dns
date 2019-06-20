import React, { Component } from 'react';

class ExternalLink extends Component {
    render() {
        return (<svg id="Layer_1" style={{ height: this.props.size, width: this.props.size }} data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8.56 8.59"><title>NEWTAB</title><polyline points="4.85 1.09 0.25 1.09 0.25 8.34 7.5 8.34 7.5 3.79" fill="none" stroke="#AFADB6" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.5" /><polyline points="5.79 0.27 8.31 0.25 8.31 2.76" fill="none" stroke="#AFADB6" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.5" /><line x1="8.31" y1="0.25" x2="4.34" y2="4.22" fill="none" stroke="#AFADB6" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.5" /></svg>)
    }
}

export default ExternalLink;
import React, { Component } from 'react';

class PenPaper extends Component {
    render() {
        return (<svg id="Layer_1" style={{ height: this.props.size, width: this.props.size }} data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10.35 10.35"><title>markup</title><polyline points="5.31 2.14 0.27 2.14 0.27 10.07 8.21 10.07 8.21 5.1" fill="none" stroke="#AFADB6" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.55" /><path d="M14.71,5.39,9.64,10.46l-.89.29h0L9,9.86,14.1,4.79a.43.43,0,0,1,.61,0h0A.44.44,0,0,1,14.71,5.39Z" transform="translate(-4.76 -4.39)" fill="none" stroke="#AFADB6" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.55" /></svg>)
    }
}

export default PenPaper;
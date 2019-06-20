import React, { Component } from 'react';

class Document extends Component {
    render() {
        return (
            <svg style={{height:this.props.size, width:this.props.size, stroke:'#656575', fill:'#656575'}} viewBox="0 0 40.82 54.09" xmlns="http://www.w3.org/2000/svg">
                <polyline points="40.57 20.15 40.57 53.84 0.25 53.84 0.25 0.25 23.22 0.25" fill="none" stroke="#706e7d" stroke-linecap="round" stroke-linejoin="round" stroke-width=".5"/>
                <polygon points="40.57 20.15 23.22 0.25 23 17.82" fill="none" stroke="#706e7d" stroke-linecap="round" stroke-linejoin="round" stroke-width=".5"/>
            </svg>
        )
    }
}

export default Document;
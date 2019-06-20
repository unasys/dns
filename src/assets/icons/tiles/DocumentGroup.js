


import React, { Component } from 'react';

class DocumentGroup extends Component {
    render() {
        return (
            <svg style={{height:this.props.size, width:this.props.size, stroke:'#656575', fill:'#656575'}} viewBox="0 0 43.66 55.2" xmlns="http://www.w3.org/2000/svg">
                <polyline points="9.14 0.34 28.31 0.34 43.32 15.35 43.32 46.06" fill="none" stroke="#6f6e7c" stroke-linecap="round" stroke-linejoin="round" stroke-width=".69"/>
                <path transform="translate(-1.99 -1.76)" d="M5.61,7.06a3.29,3.29,0,0,0-3.28,3.28v43a3.29,3.29,0,0,0,3.28,3.28H37.06a3.28,3.28,0,0,0,3.28-3.28V22.39L25,7.06ZM22.79,24.78V9.29l15.5,15.49Z" fill="none" stroke="#6f6e7c" stroke-linecap="round" stroke-linejoin="round" stroke-width=".69"/>
            </svg>

        )
    }
}

export default DocumentGroup;
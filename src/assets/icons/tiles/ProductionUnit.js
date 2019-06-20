import React, { Component } from 'react';

class ProductionUnit extends Component {

    render() {
        const st0Styles = {
            fill:'none',stroke:'#6F6E7C',strokeWidth:'0.6169',strokeLinecap:'round',strokeLinejoin:'round',strokeMiterlimit:'10'
        }
        return (
            <svg style={{height:this.props.size, width:this.props.size, stroke:'#656575', fill:'#656575'}} viewBox="0 0 49.1 52.7" xmlns="http://www.w3.org/2000/svg">
            <style type="text/css">
                
            </style>
                <polygon style={st0Styles} points="24.3 52.4 24.3 24.5 0.3 12.4 0.3 40.4"/>
                <polygon style={st0Styles} points="24.3 24.5 24.3 52.4 48.7 40.4 48.7 12.4"/>
                <line style={st0Styles} x1="36.5" x2="36.5" y1="18.4" y2="46.4"/>
                <line style={st0Styles} x1="12.2" x2="12.2" y1="18.4" y2="46.4"/>
                <line style={st0Styles} x1="48.7" x2="24.3" y1="26.7" y2="38.7"/>
                <line style={st0Styles} x1="24.3" x2=".3" y1="38.6" y2="26.5"/>
                <polyline style={st0Styles} points="48.7 12.4 24.7 0.3 0.3 12.4"/>
                <line style={st0Styles} x1="36.4" x2="12.4" y1="18.6" y2="6.5"/>
                <line style={st0Styles} x1="35.9" x2="11.9" y1="6.1" y2="18.2"/>
            </svg>

        )
    }
}

export default ProductionUnit;
import React from 'react';

export default class Circle02 extends React.Component {
    render() {
       return (
        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
            viewBox="0 0 16.8 16.8" style={{enableBackground:'new 0 0 16.8 16.8', width:this.props.size}}>
        <g>
            <g>
                <text transform="matrix(1 0 0 1 5.79 10.7141)" style={{fill:'#EEEDED', fontFamily:'Roboto', fontSize:'6px'}}>{this.props.text}</text>
            </g>
            <linearGradient id="SVGID_2_" gradientUnits="userSpaceOnUse" x1="2.4634" y1="14.3577" x2="14.3577" y2="2.4634">
                <stop  offset="0" stopColor='#B2CD3C'/>
                <stop  offset="0.9711" stopColor='#78CDF4'/>
            </linearGradient>
            <circle style={{fill:'none', stroke:'url(#SVGID_2_)',strokeWidth:'0.5', strokeLinecap:'round', strokeLinejoin:'round', strokeMiterlimit:'10'}} cx="8.4" cy="8.4" r="8.2"/>
        </g>
        </svg>
       )
    }
}

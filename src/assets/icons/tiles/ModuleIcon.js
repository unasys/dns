import React, { Component } from 'react';

class ModuleIcon extends Component {

    render() {
        return (
        <svg style={{height:this.props.size, width:this.props.size, stroke:'#656575', fill:'#656575'}} enable-background="new 0 0 60 60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
            <g>
                <path stroke-width="1" fill="transparent" d="m30 0c-16.542 0-30 13.458-30 30s13.458 30 30 30 30-13.458 30-30-13.458-30-30-30zm0"/>
                <path stroke-width="1" fill="transparent" d="m39 20c3.309 0 6-2.691 6-6s-2.691-6-6-6c-3.131 0-5.705 2.411-5.973 5.474l-14.066 10.314c-0.875-0.499-1.884-0.788-2.961-0.788-3.309 0-6 2.691-6 6s2.691 6 6 6c1.077 0 2.086-0.289 2.961-0.788l14.065 10.314c0.269 3.063 2.843 5.474 5.974 5.474 3.309 0 6-2.691 6-6s-2.691-6-6-6c-2.69 0-4.972 1.78-5.731 4.223l-12.716-9.325c0.899-1.05 1.447-2.41 1.447-3.898s-0.548-2.848-1.448-3.898l12.716-9.325c0.76 2.443 3.042 4.223 5.732 4.223zm0-10c2.206 0 4 1.794 4 4s-1.794 4-4 4-4-1.794-4-4 1.794-4 4-4zm-27 19c0-2.206 1.794-4 4-4s4 1.794 4 4-1.794 4-4 4-4-1.794-4-4zm27 11c2.206 0 4 1.794 4 4s-1.794 4-4 4-4-1.794-4-4 1.794-4 4-4z"/>
            </g>
        </svg>

        )
    }
}

export default ModuleIcon;
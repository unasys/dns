import './Tab.scss';
import React from 'react';

function Tab(props) {
    return <div className={"tab-container "  + (props.isActive ? 'active' : '')} onClick={() => props.onClick(props.id)}>
        <div className="tab">          
            {props.name}           
        </div>
    </div>
}

export default Tab;
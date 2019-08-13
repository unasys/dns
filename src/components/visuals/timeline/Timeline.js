import React, { useState } from 'react';
import HorizontalTimeline from 'react-horizontal-timeline';
import './Timeline.scss';

function Timeline (props) {
    let [value, setValue] = useState(0);
    let [previous, setPrevious] = useState(0);
    return (<div>
        <div style={{ width: '100%', height: '100px', margin: '0 auto' }}>
        <HorizontalTimeline
            styles={{outline: 'white', background: '#262B38', foreground: '#7b9d6f'}}
            index={value}
            indexClick={(index) => {
            setPrevious(value);
            setValue(index);
            }}
            values={ props.values } />
        </div>
        <div className='text-center'>
            {/* any arbitrary component can go here */}    
        </div>
    </div>)
}

export default Timeline;
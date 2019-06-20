import React from 'react';
import InitialSelection from '../../../assets/icons/tiles/InitialSelection';

export default function RenderInitialSelection(initialSelection, onClick) {
    return (<div className="tile" key={initialSelection.id} onClick={() => onClick(initialSelection)}>
        <div className="document-type-info">
            <div className="main-tile">
                <div className="title-panel" >
                    <div className="icon">
                        <InitialSelection size={'85px'}></InitialSelection>
                    </div>
                    {initialSelection.name}
                </div>
            </div>
        </div>
    </div >);
}



import React from 'react';
import NavigationHeading from './NavigationHeading';
import MapFilterPanel from './map-filter-panel/MapFilterPanel';
import NorthSeaAreaPanel from './north-sea-area-panel/NorthSeaAreaPanel';

function MenuPanel() {
    return (
        <>
            <div className="overview-thumbnail">
                <img src={`https://assets.digitalnorthsea.com/images/installations/-1.jpg`} alt="overview-thumbnail" ></img>
            </div>
            <NorthSeaAreaPanel />
            <NavigationHeading heading={'Installations'} url="installations" />
            <NavigationHeading heading={'Decom Yards'} url="decomyards" />
            <NavigationHeading heading={'Pipelines'} url="pipelines" />
            <NavigationHeading heading={'Windfarms'} url="windfarms" />
            <NavigationHeading heading={'Fields'} url="fields" />
            <MapFilterPanel />
        </>
    );

}

export default MenuPanel;
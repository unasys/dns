import React, {useState} from 'react';
import NavigationHeading from './NavigationHeading';
import MapFilterPanel from './map-filter-panel/MapFilterPanel';
import NorthSeaAreaPanel from './north-sea-area-panel/NorthSeaAreaPanel';
import Handle from '../../sliding-panels/handle/Handle';
import '../../infoPanels/Panels.scss';
function MenuPanel() {
    const [isVisible, setIsVisible] = useState(true);
    return (
        <div className="dns-panel left">
            <aside className={isVisible ? "menu-panel" : "menu-panel hidden"}>
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
            </aside>
            <Handle onHandleClick={() => setIsVisible(!isVisible)} isFacingLeft={true} isOpen={isVisible} />
        </div>
    );

}

export default MenuPanel;
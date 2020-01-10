import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import NorthSeaAreaPanel from './north-sea-area-panel/NorthSeaAreaPanel';
import Handle from '../../handle/Handle';
import '../../infoPanels/Panels.scss';
import { useStateValue } from '../../../utils/state';
import Switch from 'react-toggle-switch'

const MapOptions = () => {
    const [{ showBlocks, mapStyle }, dispatch] = useStateValue();

    return (
        <div className="menu-container" style={{ display: 'flex' }}>
            <div className="menu-item" style={{ width: '100%' }}>
                <div className="panel-title">
                    Layer Visibility
                </div>
                <div className="layer-container">
                    <div className="layer-content">
                        <div className="bathymetry-title">Blocks</div>
                        <Switch onClick={(e) => { e.preventDefault(); dispatch({ type: "toggleBlocks" }) }} on={showBlocks} className={'bathymetry-title'} />
                    </div>
                </div>
                <div className="layer-container">
                    <div className="layer-content">
                        <div className="bathymetry-title">Map Style ({mapStyle === "satellite" ? "satellite" : "simple"})</div>
                        <Switch onClick={(e) => { e.preventDefault(); dispatch({ type: "changeMapStyle", mapStyle: mapStyle === "satellite" ? "simple" : "satellite" }) }} on={mapStyle === "satellite"} className={'bathymetry-title'} />
                    </div>
                </div>
            </div>
        </div >);
};

const NavigationHeading = (props) => {
    return (
        <Link className="overview-container" to={props.url}>
            <div className="overview-heading">
                {props.switch}
                {props.heading}
            </div>
            <div className="dropdown-icon">
                <i className="fas fa-chevron-right icon"></i>
            </div>
        </Link>
    );
}

function MenuPanel() {
    const [isVisible, setIsVisible] = useState(true);
    const [{ showInstallations, showDecomYards, showPipelines, showFields, showWindfarms, showSubsurfaces, showWells }, dispatch] = useStateValue();
    return (
        <div className="dns-panel left">
            <div className={isVisible ? "dns-content" : "dns-content hidden"}>
                <aside className="menu-panel">
                    <div className="overview-thumbnail">
                        <img src={`https://assets.digitalnorthsea.com/images/installations/-1.jpg`} alt="overview-thumbnail" />
                    </div>
                    <NorthSeaAreaPanel />
                    <NavigationHeading heading='Installations' url="installations" switch={<Switch onClick={(e) => { e.preventDefault(); dispatch({ type: "toggleInstallations" }) }} on={showInstallations} className={'bathymetry-title'} />} />
                    <NavigationHeading heading='Decom Yards' url="decomyards" switch={<Switch onClick={(e) => { e.preventDefault(); dispatch({ type: "toggleDecomYards" }) }} on={showDecomYards} className={'bathymetry-title'} />} />
                    <NavigationHeading heading='Pipelines' url="pipelines" switch={<Switch onClick={(e) => { e.preventDefault(); dispatch({ type: "togglePipelines" }) }} on={showPipelines} className={'bathymetry-title'} />} />
                    <NavigationHeading heading='Windfarms' url="windfarms" switch={<Switch onClick={(e) => { e.preventDefault(); dispatch({ type: "toggleWindfarms" }) }} on={showWindfarms} className={'bathymetry-title'} />} />
                    <NavigationHeading heading='Fields' url="fields" switch={<Switch onClick={(e) => { e.preventDefault(); dispatch({ type: "toggleFields" }) }} on={showFields} className={'bathymetry-title'} />} />
                    <NavigationHeading heading='Subsurface' url="subsurfaces" switch={<Switch onClick={(e) => { e.preventDefault(); dispatch({ type: "toggleSubsurfaces" }) }} on={showSubsurfaces} className={'bathymetry-title'} />} />
                    <NavigationHeading heading='Wells' url="wells" switch={<Switch onClick={(e) => { e.preventDefault(); dispatch({ type: "toggleWells" }) }} on={showWells} className={'bathymetry-title'} />} />
                    <MapOptions />
                </aside>
            </div>
            <Handle onHandleClick={() => setIsVisible(!isVisible)} isFacingLeft={true} isOpen={isVisible} />
        </div>
    );

}

export default MenuPanel;
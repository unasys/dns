import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Handle from '../../handle/Handle';
import '../../infoPanels/Panels.scss';
import { useStateValue } from '../../../utils/state';
import Switch from 'react-toggle-switch'

const MapOptions = () => {
    const [{ showBlocks, mapStyle, enableTerrain, globe3D }, dispatch] = useStateValue();

    return (
        <div className="menu-container" style={{ display: 'flex' }}>
            <div className="menu-item" style={{ width: '100%' }}>

                <div className="layer-container">
                    <div className="layer-content">
                        <Switch onClick={(e) => { e.preventDefault(); dispatch({ type: "toggleBlocks" }) }} on={showBlocks} className={'bathymetry-title'} />
                        <div className="bathymetry-title">Blocks</div>
                    </div>
                </div>
                <div className="layer-container">
                    <div className="layer-content">
                        <Switch onClick={(e) => { e.preventDefault(); dispatch({ type: "toggle3D" }) }} on={globe3D} className={'bathymetry-title'} />
                        <div className="bathymetry-title">Globe Type ({globe3D ? "3D" : "2D"})</div>
                    </div>
                </div>
                <div className="layer-container">
                    <div className="layer-content">
                        <Switch onClick={(e) => { e.preventDefault(); dispatch({ type: "toggleTerrain" }) }} on={enableTerrain} className={'bathymetry-title'} />
                        <div className="bathymetry-title">Terrain</div>
                    </div>
                </div>
                <div className="layer-container">
                    <div className="layer-content">
                        <Switch onClick={(e) => { e.preventDefault(); dispatch({ type: "changeMapStyle", mapStyle: mapStyle === "satellite" ? "simple" : "satellite" }) }} on={mapStyle === "satellite"} className={'bathymetry-title'} />
                        <div className="bathymetry-title">Map Style ({mapStyle === "satellite" ? "satellite" : "simple"})</div>
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
    const [{ showInstallations, showPipelines, showFields, showWindfarms, showSubsurfaces, showWells, showWrecks, showAreas, showBasins, showOnshoreGasPipes, showOnshoreGasSites, showOnshoreGridCables, showOnshorePowerlines, showOnshoreWindfarms, showWorkingGroups }, dispatch] = useStateValue();
    return (
        <div className="dns-panel left">
            <div className={isVisible ? "dns-content" : "dns-content hidden"}>
                <aside className="menu-panel">
                    <NavigationHeading heading='Installations' url="installations" switch={<Switch onClick={(e) => { e.preventDefault(); dispatch({ type: "toggleInstallations" }) }} on={showInstallations} className={'bathymetry-title'} />} />
                    {/* <NavigationHeading heading='Decom Yards' url="decomyards" switch={<Switch onClick={(e) => { e.preventDefault(); dispatch({ type: "toggleDecomYards" }) }} on={showDecomYards} className={'bathymetry-title'} />} /> */}
                    <NavigationHeading heading='Pipelines' url="pipelines" switch={<Switch onClick={(e) => { e.preventDefault(); dispatch({ type: "togglePipelines" }) }} on={showPipelines} className={'bathymetry-title'} />} />
                    <NavigationHeading heading='Windfarms' url="windfarms" switch={<Switch onClick={(e) => { e.preventDefault(); dispatch({ type: "toggleWindfarms" }) }} on={showWindfarms} className={'bathymetry-title'} />} />
                    <NavigationHeading heading='Basins' url="basins" switch={<Switch onClick={(e) => { e.preventDefault(); dispatch({ type: "toggleBasins" }) }} on={showBasins} className={'bathymetry-title'} />} />
                    <NavigationHeading heading='Areas' url="areas" switch={<Switch onClick={(e) => { e.preventDefault(); dispatch({ type: "toggleAreas" }) }} on={showAreas} className={'bathymetry-title'} />} />
                    <NavigationHeading heading='Fields' url="fields" switch={<Switch onClick={(e) => { e.preventDefault(); dispatch({ type: "toggleFields" }) }} on={showFields} className={'bathymetry-title'} />} />
                    <NavigationHeading heading='Subsurface' url="subsurfaces" switch={<Switch onClick={(e) => { e.preventDefault(); dispatch({ type: "toggleSubsurfaces" }) }} on={showSubsurfaces} className={'bathymetry-title'} />} />
                    <NavigationHeading heading='Wells' url="wells" switch={<Switch onClick={(e) => { e.preventDefault(); dispatch({ type: "toggleWells" }) }} on={showWells} className={'bathymetry-title'} />} />
                    <NavigationHeading heading='Wrecks' url="wrecks" switch={<Switch onClick={(e) => { e.preventDefault(); dispatch({ type: "toggleWrecks" }) }} on={showWrecks} className={'bathymetry-title'} />} />
                    <NavigationHeading heading='Onshore Gas Pipes' url="onshoregaspipes" switch={<Switch onClick={(e) => { e.preventDefault(); dispatch({ type: "toggleOnshoreGasPipes" }) }} on={showOnshoreGasPipes} className={'bathymetry-title'} />} />
                    <NavigationHeading heading='Onshore Gas Sites' url="onshoregassites" switch={<Switch onClick={(e) => { e.preventDefault(); dispatch({ type: "toggleOnshoreGasSites" }) }} on={showOnshoreGasSites} className={'bathymetry-title'} />} />
                    <NavigationHeading heading='Onshore Grid Cables' url="onshoregridcables" switch={<Switch onClick={(e) => { e.preventDefault(); dispatch({ type: "toggleOnshoreGridCables" }) }} on={showOnshoreGridCables} className={'bathymetry-title'} />} />
                    <NavigationHeading heading='Onshore Powerlines' url="onshorepowerlines" switch={<Switch onClick={(e) => { e.preventDefault(); dispatch({ type: "toggleOnshorePowerlines" }) }} on={showOnshorePowerlines} className={'bathymetry-title'} />} />
                    <NavigationHeading heading='Onshore Windfarms' url="onshorewindfarms" switch={<Switch onClick={(e) => { e.preventDefault(); dispatch({ type: "toggleOnshoreWindfarms" }) }} on={showOnshoreWindfarms} className={'bathymetry-title'} />} />
                    <NavigationHeading heading='Working Groups' url="workinggroups" switch={<Switch onClick={(e) => { e.preventDefault(); dispatch({ type: "toggleWorkingGroups" }) }} on={showWorkingGroups} className={'bathymetry-title'} />} />
                    <MapOptions />
                </aside>
            </div>
            <Handle onHandleClick={() => setIsVisible(!isVisible)} isFacingLeft={true} isOpen={isVisible} />
        </div>
    );

}

export default MenuPanel;
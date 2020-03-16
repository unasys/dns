import React, { useState, } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useStateValue } from '../../utils/state';
import InstallationInfoPanel from './InstallationInfoPanel';
import AreaInfoPanel from './AreaInfoPanel';
import './Panels.scss'
import Handle from '../handle/Handle';
import EntryContainer from './EntryContainer';
import Entry from './Entry';
import TitleBar from './TitleBar';
import Slider from 'rc-slider';

function radiusEntryIsClickable(showInstallations, showPipelines, showWindfarms, showDecomYards, showFields, showBlocks, showSubsurfaces, showWells, showWrecks, showAreas, showBasins, collection) {
    switch (collection) {
        case "Installation": return showInstallations
        case "Pipeline": return showPipelines
        case "Windfarm": return showWindfarms
        case "Area": return showAreas;
        case "Basin": return showBasins;
        case "Field": return showFields;
        case "DecomYard": return showDecomYards;
        case "Subsurface": return showSubsurfaces;
        case "Well": return showWells;
        case "Wreck": return showWrecks;
        default:
            return false;
    }
}

function WithInDistance() {
    const [{ withInDistance, showInstallations, showPipelines, showWindfarms, showDecomYards, showFields, showBlocks, showSubsurfaces, showWells, showWrecks, showAreas, showBasins },] = useStateValue();
    const output = [];
    for (const p in withInDistance) {
        const entities = withInDistance[p];
        output.push(<EntryContainer open={false} key={`${p}`} title={`${p}  (${entities.length.toLocaleString()})`} borderBottom>
            {entities.map(e => {
                const isClickable = radiusEntryIsClickable(showInstallations, showPipelines, showWindfarms, showDecomYards, showFields, showBlocks, showSubsurfaces, showWells, showWrecks, showAreas, showBasins, p);
                if (isClickable) {
                    return (<Link key={`${e.entity.id}`} to={location => ({ ...location, search: `?etype=${p}&eid=${e.entity.id}` })}>
                        <Entry key={`${e.entity.id}`} title={`${e.entity.name}`} subtitle={`${(e.distance / 1000).toFixed(2).toLocaleString()}km`} borderBottom />
                    </Link>)
                } else {
                    return (
                        <Entry key={`${e.entity.id}`} title={`${e.entity.name}`} subtitle={`${(e.distance / 1000).toFixed(2).toLocaleString()}km`} borderBottom />
                    )
                }
            })}
        </EntryContainer>);
    }

    return (
        <>
            {output}
        </>
    );
}
function getEntity(installations, pipelines, windfarms, areas, wells, wrecks, basins,fields, eType, eId) {
    switch (eType) {
        case "Installation": return installations.get(eId);
        case "Pipeline": return pipelines.get(eId);
        case "Windfarm": return windfarms.get(eId);
        case "Area": return areas.get(eId);
        case "Basin": return basins.get(eId);
        case "Well": return wells.get(eId);
        case "Wreck": return wrecks.get(eId);
        case "Field":return fields.get(eId);
        case "DecomYard":
        default:
            return null;
    }
}

function choosePanel(installations, areas, eType, entity) {
    if (!entity) {
        const northSea = { name: "North Sea" };
        return <AreaInfoPanel installations={installations} area={northSea} />;
    } else if (entity.InfoPanel) {
        return <DataDriveInfoPanel name={entity.name} image={entity.ImageID} epm={entity.ePMID} type={eType} details={entity.InfoPanel} />
    } else {
        switch (eType) {
            case "Installation": return <InstallationInfoPanel installation={entity} />;
            case "Area": return <AreaInfoPanel installations={installations} area={entity} />;
            case "DecomYard":
            default:
                const northSea = areas.get("North Sea");
                return <AreaInfoPanel installations={installations} area={northSea} />;
        }
    }
}


function DataDriveInfoPanel({ name, type, details, image, epm }) {
    return (
        <div>
            <TitleBar title={name} subtitle={type} image={image} epm={epm} />

            {details.map(d => (<EntryContainer key={d.name} title={d.name} subtitle={d.value} open={d.expaned ?? false} borderBottom>
                {d.values.map(v => (<Entry key={v.name} title={v.name} subtitle={v.values} type={v.type} borderBottom />))}

            </EntryContainer>))}
        </div>
    );
}

const marks = {
    0: 0,
    5: 5,
    10: 10,
    15: 15,
    20: 20,
    25: 25,
    30: 30
};


function InfoPanel() {
    const [{ installations, pipelines, windfarms, areas, wells, wrecks, basins, fields }, dispatch] = useStateValue();
    const location = useLocation();
    const [isVisible, setIsVisible] = useState(true);
    const search = new URLSearchParams(location.search);
    const eid = search.get("eid");
    const etype = search.get("etype");

    let entity = getEntity(installations, pipelines, windfarms, areas, wells, wrecks, basins,fields, etype, eid);
    let panel = choosePanel(installations, areas, etype, entity);

    return (
        panel &&
        <div className="dns-panel right">
            <Handle onHandleClick={() => setIsVisible(!isVisible)} isFacingLeft={false} isOpen={isVisible} />
            <div className={isVisible ? "dns-split" : "dns-split hidden"}>
                <aside className="sidePanel">
                    <div className="dns-content">
                        {panel}
                    </div>
                </aside>
                <aside className="nearby">
                    <div className="dns-content">
                        <div className="radius">
                            <svg viewBox="0 0 10 10" width="60px">
                                <circle cx="5" cy="5" r="4" strokeWidth="1.5" stroke="#fff" fill="#fff" fillOpacity="0.0" />
                                <circle cx="5" cy="5" r="2" fill="#61626c" />
                            </svg>
                            <Slider min={0} max={30} marks={marks} defaultValue={10} onChange={e => dispatch({ type: "changeRadius", radius: e })}
                                railStyle={{ backgroundColor: '#61626c' }}
                                trackStyle={{ backgroundColor: '#fff' }}
                                dotStyle={{ display: 'none' }}
                                activeDotStyle={{ display: 'none' }}
                                handleStyle={{
                                    borderColor: '#fff',
                                    backgroundColor: 'green'
                                }}></Slider>
                        </div>
                        <WithInDistance />
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default InfoPanel;
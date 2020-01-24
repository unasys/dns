import React, { useState, } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useStateValue } from '../../utils/state';
import InstallationInfoPanel from './InstallationInfoPanel';
import PipelineInfoPanel from './PipelineInfoPanel';
import AreaInfoPanel from './AreaInfoPanel';
import './Panels.scss'
import Handle from '../handle/Handle';
import EntryContainer from './EntryContainer';
import Entry from './Entry';
import TitleBar from './TitleBar';

function radiusEntryIsClickable(showInstallations, showPipelines, showWindfarms, showDecomYards, showFields, showBlocks, showSubsurfaces, showWells,showWrecks, collection) {
    switch (collection) {
        case "Installation": return showInstallations
        case "Pipeline": return showPipelines
        case "Windfarm": return showWindfarms
        case "Area": return true;
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
    const [{ withInDistance, showInstallations, showPipelines, showWindfarms, showDecomYards, showFields, showBlocks, showSubsurfaces, showWells, showWrecks },] = useStateValue();
    const output = [];
    for (const p in withInDistance) {
        const value = withInDistance[p];
        for (const p2 in value) {
            const entities = value[p2];
            output.push(<EntryContainer open={false} key={`${p}${p2}`} title={`With In: ${p} : ${p2} (${entities.length.toLocaleString()})`} borderBottom>
                {entities.map(e => {
                    const isClickable = radiusEntryIsClickable(showInstallations, showPipelines, showWindfarms, showDecomYards, showFields, showBlocks, showSubsurfaces, showWells, showWrecks, p2);
                    if (isClickable) {
                        return (<Link key={`${e.entity.id}`} to={location => ({ ...location, search: `?etype=${p2}&eid=${e.entity.id}` })}>
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
    }

    return (
        <>
            {output}
        </>
    );
}
function getEntity(installations, pipelines, windfarms, areas, wells,wrecks, eType, eId) {
    switch (eType) {
        case "Installation": return installations.get(eId);
        case "Pipeline": return pipelines.get(eId);
        case "Windfarm": return windfarms.get(eId);
        case "Area": return areas.get(eId);
        case "Well": return wells.get(eId);
        case "Wreck": return wrecks.get(eId);
        case "Field":
        case "DecomYard":
        default:
            return null;
    }
}

function choosePanel(installations, areas, eType, entity) {
    if (!entity) {
        const northSea = areas.get("North Sea");
        return <AreaInfoPanel installations={installations} area={northSea} />;
    } else if (entity.InfoPanel) {
        return <DataDriveInfoPanel name={entity.name} type={eType} details={entity.InfoPanel} />
    } else {
        switch (eType) {
            case "Installation": return <InstallationInfoPanel installation={entity} />;
            case "Pipeline": return <PipelineInfoPanel pipeline={entity} />;
            case "Area": return <AreaInfoPanel installations={installations} area={entity} />;
            case "Field":
            case "DecomYard":
            default:
                const northSea = areas.get("North Sea");
                return <AreaInfoPanel installations={installations} area={northSea} />;
        }
    }
}


function DataDriveInfoPanel({ name, type, details }) {
    return (
        <div>
            <TitleBar title={name} subtitle={type} />

            {details.map(d => (<EntryContainer key={d.name} title={d.name} open={d.expaned??false} borderBottom>
                {d.values.map(v => (<Entry key={v.name} title={v.name} subtitle={v.values} type={v.type} borderBottom />))}

            </EntryContainer>))}
        </div>
    );
}

function InfoPanel() {
    const [{ installations, pipelines, windfarms, areas, wells, wrecks },] = useStateValue();
    const location = useLocation();
    const [isVisible, setIsVisible] = useState(true);
    const search = new URLSearchParams(location.search);
    const eid = search.get("eid");
    const etype = search.get("etype");

    let entity = getEntity(installations, pipelines, windfarms, areas, wells,wrecks, etype, eid);
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
                        <WithInDistance />
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default InfoPanel;
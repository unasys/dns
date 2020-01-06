import React, { useState, } from 'react';
import { useLocation } from 'react-router-dom';
import { useStateValue } from '../../utils/state';
import InstallationInfoPanel from './InstallationInfoPanel';
import PipelineInfoPanel from './PipelineInfoPanel';
import WindfarmInfoPanel from './WindfarmPanel';
import AreaInfoPanel from './AreaInfoPanel';
import './Panels.scss'
import Handle from '../handle/Handle';
import EntryContainer from './EntryContainer';
import Entry from './Entry';

function WithInDistance() {
    const [{ withInDistance },] = useStateValue();
    const output = [];
    for (const p in withInDistance) {
        const value = withInDistance[p];
        for (const p2 in value) {
            const entities = value[p2];
            output.push(<EntryContainer key={`${p}${p2}`} title={`With In: ${p} : ${p2} (${entities.length.toLocaleString()})`} borderBottom>
                {entities.map(e => <Entry key={`${e.entity.id}`} title={`${e.entity.name}`} subtitle={`${(e.distance/1000).toFixed(2).toLocaleString()}km`} borderBottom />)}
            </EntryContainer>);
        }
    }

    return (
        <>
            {output}
        </>
    );
}
function getEntity(installations, pipelines, windfarms, areas, eType, eId) {
    switch (eType) {
        case "Installation": return installations.get(eId);
        case "Pipeline": return pipelines.get(eId);
        case "Windfarm": return windfarms.get(eId);
        case "Area": return areas.get(eId);
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
    } else {
        switch (eType) {
            case "Installation": return <InstallationInfoPanel installation={entity} />;
            case "Pipeline": return <PipelineInfoPanel pipeline={entity} />;
            case "Windfarm": return <WindfarmInfoPanel windfarm={entity} />;
            case "Area": return <AreaInfoPanel installations={installations} area={entity} />;
            case "Field":
            case "DecomYard":
            default:
                const northSea = areas.get("North Sea");
                return <AreaInfoPanel installations={installations} area={northSea} />;
        }
    }
}

function InfoPanel() {
    const [{ installations, pipelines, windfarms, areas },] = useStateValue();
    const location = useLocation();
    const [isVisible, setIsVisible] = useState(true);
    const search = new URLSearchParams(location.search);
    const eid = search.get("eid");
    const etype = search.get("etype");

    let entity = getEntity(installations, pipelines, windfarms, areas, etype, eid);
    let panel = choosePanel(installations, areas, etype, entity);

    return (
        panel &&
        <div className="dns-panel right">
            <Handle onHandleClick={() => setIsVisible(!isVisible)} isFacingLeft={false} isOpen={isVisible} />
            <div className={isVisible ? "dns-content" : "dns-content hidden"}>
                <aside className="sidePanel">
                    {panel}
                    <WithInDistance />
                </aside>
            </div>
        </div>
    );
}

export default InfoPanel;
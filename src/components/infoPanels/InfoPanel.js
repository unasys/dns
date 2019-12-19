import React, { useState,  } from 'react';
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

export function WithInDistance() {
    const [{ withInDistance },] = useStateValue();
    const output = [];
    for (const property in withInDistance) {
        const value = withInDistance[property];
        output.push(<EntryContainer title={`With In: ${property} (${value.length})`} borderBottom>
            {value.map(e => <Entry title={`${e.entity.Name} (${e.type})`} subtitle={e.distance} borderBottom />)}
        </EntryContainer>);
    }

    return (
        { output }
    );
}

function InfoPanel() {
    const [{ installations, pipelines, windfarms, areas },] = useStateValue();
    const location = useLocation();
    const [isVisible, setIsVisible] = useState(true);
    const search = new URLSearchParams(location.search);
    const eid = search.get("eid");
    const etype = search.get("etype");

    let panel = null;
    switch (etype) {
        case "Installation": {
            const entity = installations.get(eid);
            if (entity) {
                panel = <InstallationInfoPanel installation={entity} />;
            }
            break;
        }
        case "Pipeline": {
            const entity = pipelines.get(eid);
            if (entity) {
                panel = <PipelineInfoPanel pipeline={entity} />;
            }
            break;
        }
        case "Windfarm": {
            const entity = windfarms.get(eid);
            if (entity) {
                panel = <WindfarmInfoPanel windfarm={entity} />;
            }
            break;
        }
        case "Area": {
            const entity = areas.get(eid);
            if (entity) {
                panel = <AreaInfoPanel nstallations={installations} area={entity} />;
            }
            break;
        }
        case "Field":
        case "DecomYard":
        default:
            break;
    }


    return (
        panel &&
        <div className="dns-panel right">
            <Handle onHandleClick={() => setIsVisible(!isVisible)} isFacingLeft={false} isOpen={isVisible} />
            <div className={isVisible ? "dns-content" : "dns-content hidden"}>
                <aside className="sidePanel">{panel}</aside>
            </div>
        </div>
    );
}

export default InfoPanel;
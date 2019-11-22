import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useStateValue } from '../../utils/state';
import InstallationInfoPanel from './InstallationInfoPanel';
import PipelineInfoPanel from './PipelineInfoPanel';
import WindfarmInfoPanel from './WindfarmPanel';
import AreaInfoPanel from './AreaInfoPanel';
import './Panels.scss'
import Handle from '../sliding-panels/handle/Handle';

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
                panel = <AreaInfoPanel installations={installations} area={entity} />;
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
            <aside className={isVisible ? "sidePanel" : "sidePanel hidden"}>{panel}</aside>
        </div>
    );
}

export default InfoPanel;
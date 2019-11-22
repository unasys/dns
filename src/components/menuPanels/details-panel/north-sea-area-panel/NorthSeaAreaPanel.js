import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import './NorthSeaAreaPanel.scss';
import { useStateValue } from '../../../../utils/state';

const ResultItem = (content, highlighted) => {
    const history = useHistory();
    const location = useLocation();
    const search = new URLSearchParams(location.search);
    search.set("etype", "Area");
    search.set("eid", content.name);
    return (<div key={content.name} className="area-result-item-container">
        <div className={"area-result-item" + (highlighted === content.name ? ' highlighted' : '')} onClick={(e) => history.push(location.pathname + `?${search.toString()}`)}>
            {content.indented && <i class="fas fa-share" style={{ transform: 'scaleY(-1)', paddingLeft: '10px', paddingRight: '5px' }}></i>}
            {content.name}
        </div>
    </div>);
}

const NorthSeaAreaPanel = () => {
    const [{ areas },] = useStateValue();
    const location = useLocation();
    const search = new URLSearchParams(location.search);
    const etype = search.get("etype");
    const eid = search.get("eid");
    const highlighted = etype === "Area" ? eid : "North Sea"

    return (
        <div className="areas">
            {[...areas.values()].map(area => ResultItem(area, highlighted))}
        </div>
    )
}

export default NorthSeaAreaPanel;


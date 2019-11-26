import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './NorthSeaAreaPanel.scss';
import { useStateValue } from '../../../../utils/state';

const ResultItem = (content, highlighted, location) => {
    const search = new URLSearchParams(location.search);
    search.set("etype", "Area");
    search.set("eid", content.name);
    return (<Link key={content.name} className="area-result-item-container" to={location => ({ ...location, search: `?${search.toString()}` })}>
        <div className={"area-result-item" + (highlighted === content.name ? ' highlighted' : '')} >
            {content.indented && <i class="fas fa-share" style={{ transform: 'scaleY(-1)', paddingLeft: '10px', paddingRight: '5px' }}></i>}
            {content.name}
        </div>
    </Link>);
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
            {[...areas.values()].map(area => ResultItem(area, highlighted, search))}
        </div>
    )
}

export default NorthSeaAreaPanel;


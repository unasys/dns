import React, { useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import './Tiles.scss';

function Tiles(props) {
    const [inProp, setInProp] = useState(false);
    const [tileGridSize, setTileGridSize] = useState("large")

    useEffect(() => {
        setInProp(true)
    });

    return <div>
        <CSSTransition in={inProp} timeout={2000} unmountOnExit classNames="my-node">
            <span className="tile-size-control">
                <select onChange={(e) => setTileGridSize(e.target.value)}>
                    <option value="large">Wide</option>
                    <option value="small">Small</option>
                    <option value="hidden">Hidden</option>
                </select>
                <div className={"tile-grid" + " " + tileGridSize}>
                    {props.children}
                </div>
            </span>
        </CSSTransition>
    </div>
}

export default Tiles;
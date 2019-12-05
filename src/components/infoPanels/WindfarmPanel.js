import React from 'react';
import './Panels.scss';
import EntryContainer from './EntryContainer';
import Entry from './Entry';

function WindfarmInfoPanel(props) {
    if (!props.windfarm) return <div>Windfarm not supported.</div>;

    let windfarmDetails = props.windfarm;
    let windfarmName = windfarmDetails.NAME;
    let windfarmCost = windfarmDetails["BUILD COST"];
    let windfarmBuilder = windfarmDetails["BUILDER"];
    let windfarmBuildLocation = windfarmDetails["BUILD LOCATION"];
    let capacityFactor = windfarmDetails["CAPACITY FACTOR"];
    let firstPower = windfarmDetails["First Power"];
    let MWCAP = windfarmDetails["MW CAP"];
    let owner = windfarmDetails["OWNER"];
    let status = windfarmDetails["STATUS"]
    let turbines = windfarmDetails["TURBINES"];

    return (
        <div>
            <EntryContainer title={windfarmName} borderBottom>
                <Entry title={"Owner"} subtitle={owner}></Entry>
                <Entry title={"Status"} subtitle={status}></Entry>
                <Entry title={"First Power"} subtitle={firstPower}></Entry>
                <Entry title={"Capacity Factor"} subtitle={capacityFactor}></Entry>
                <Entry title={"MW Cap"} subtitle={MWCAP}></Entry>
                <Entry title={"Turbines"} subtitle={turbines}></Entry>
            </EntryContainer>
            <EntryContainer title="Build" borderBottom>
                <Entry title={"Builder"} subtitle={windfarmBuilder}></Entry>
                <Entry title={"Build Location"} subtitle={windfarmBuildLocation}></Entry>
                <Entry title={"Build Cost"} subtitle={windfarmCost}></Entry>
            </EntryContainer>
        </div>
    );
}

export default WindfarmInfoPanel;

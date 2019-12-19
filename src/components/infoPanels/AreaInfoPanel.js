import React from 'react';
import './Panels.scss';
import EntryContainer from './EntryContainer';
import Entry from './Entry';

function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
}

function AreaInfoPanel(props) {
    if (!props.area) return <div>Area not supported.</div>;
    let areaName = props.area.name;
    let areaCode = props.area.areaCode;

    let numberOfInstallations;
    let averageAge;
    let installationsInArea;
    let installationTypes;

    if (areaName !== "North Sea") {
        installationsInArea = [...props.installations.values()].filter(installation => areaCode === installation.Area)
    } else {
        installationsInArea = [...props.installations.values()];
    }

    numberOfInstallations = installationsInArea.length
    averageAge = installationsInArea.map(installation => installation.Age).reduce((acc, age) => age + acc, 0) / installationsInArea.length;
    installationTypes = groupBy(installationsInArea, installation => installation.Type);

    let installationTypeEntries = [];

    installationTypes.forEach((value, key) => {
        installationTypeEntries.push(<Entry key={key} title={key} subtitle={value.length} borderBottom></Entry>);
    })

    var dateNow = new Date();
    var year = dateNow.getFullYear();
    var month = dateNow.getMonth();
    var day = dateNow.getDate();
    var next5Years = new Date(year + 5, month, day);
    var next10Years = new Date(year + 10, month, day);

    let decomNext5Years = installationsInArea.filter(installation => {
        let plannedCOP = new Date(installation.PlannedCOP);
        return plannedCOP > dateNow && plannedCOP < next5Years;
    }).length

    let decomNext10Years = installationsInArea.filter(installation => {
        let plannedCOP = new Date(installation.PlannedCOP);
        return plannedCOP > dateNow && plannedCOP < next10Years;
    }).length

    let weightInArea = installationsInArea.reduce((acc, installation) => {
        return acc + installation.TopsideWeight + installation.SubStructureWeight
    }, 0)

    let averageWaterDepth = installationsInArea.reduce((acc, installation) => acc + installation.WaterDepth, 0) / installationsInArea.length
    let maxWaterDepth = Math.max(...installationsInArea.map(installation => installation.WaterDepth));

    let sketchfabModels = <></>;
    if (props.area.sketchfabModels) {
        sketchfabModels = props.area.sketchfabModels.map(m => (<iframe key={m} className="sketchfab-viewer" title={m} id="view360Iframe" width="100%" height='350px' scrolling="0" src={`https://sketchfab.com/models/${m}/embed?ui_infos=0&amp;ui_watermark=0&amp;ui_help=0&amp;ui_settings=0&amp;ui_inspector=0&amp;ui_annotations=0&amp;ui_stop=0&amp;ui_vr=0&amp;preload=1&amp;autostart=1&amp;ui_hint=2&amp;autospin=0.2`} />))
    }

    return (
        <div>
            <EntryContainer title={areaName} borderBottom>
                <Entry title={"Installations"} subtitle={numberOfInstallations}></Entry>
                <Entry title={"Avg Age"} subtitle={Math.round(averageAge) + " years"}></Entry>
            </EntryContainer>
            <EntryContainer title="Installations" borderBottom>
                {installationTypeEntries}
            </EntryContainer>
            <EntryContainer title="Decommissioning" borderBottom>
                <Entry title={"Decom next 5 years"} subtitle={decomNext5Years}></Entry>
                <Entry title={"Decom next 10 years"} subtitle={decomNext10Years}></Entry>
            </EntryContainer>
            <EntryContainer title="Weight" borderBottom>
                <Entry icon={<i className="fas fa-dumbbell" style={{ fontSize: '20px' }}></i>} title={"Total Weight"} subtitle={weightInArea + " te"}></Entry>
            </EntryContainer>
            <EntryContainer title="Sea" borderBottom>
                <Entry title={"Avg Water Depth"} subtitle={Math.round(averageWaterDepth) + "m"}></Entry>
                <Entry title={"Max Water Depth"} subtitle={maxWaterDepth + "m"}></Entry>
            </EntryContainer>
            <EntryContainer title="Location" >
                <Entry icon={<i className="fas fa-map-marker"></i>} title={"Location"} ></Entry>
            </EntryContainer>
            {sketchfabModels}
        </div>
    );
}

export default AreaInfoPanel;

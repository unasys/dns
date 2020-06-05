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
import { groupByAndSort } from '../../utils/utils';

function radiusEntryIsClickable(showInstallations, showPipelines, showWindfarms, showDecomYards, showFields, showBlocks, showSubsurfaces, showWells, showWrecks, showAreas, showBasins, showOnshoreGasPipes, showOnshoreGasSites, showOnshoreGridCables, showOnshorePowerlines, showOnshoreWindfarms,showWorkingGroups, collection) {
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
        case "OnshoreGasPipe": return showOnshoreGasPipes;
        case "OnshoreGasSite": return showOnshoreGasSites;
        case "OnshoreGridCable": return showOnshoreGridCables;
        case "OnshorePowerline": return showOnshorePowerlines;
        case "OnshoreWindfarm": return showOnshoreWindfarms;
        case "WorkingGroup": return showWorkingGroups;
        default:
            return false;
    }
}

function WithInDistance() {
    const [{ withInDistance, showInstallations, showPipelines, showWindfarms, showDecomYards, showFields, showBlocks, showSubsurfaces, showWells, showWrecks, showAreas, showBasins,showOnshoreGasPipes, showOnshoreGasSites, showOnshoreGridCables, showOnshorePowerlines, showOnshoreWindfarms, showWorkingGroups },] = useStateValue();
    const output = [];
    for (const p in withInDistance) {
        const entities = withInDistance[p];
        output.push(<EntryContainer open={false} key={`${p}`} title={`${p}  (${entities.length.toLocaleString()})`} borderBottom>
            {entities.map(e => {
                const isClickable = radiusEntryIsClickable(showInstallations, showPipelines, showWindfarms, showDecomYards, showFields, showBlocks, showSubsurfaces, showWells, showWrecks, showAreas, showBasins,showOnshoreGasPipes, showOnshoreGasSites, showOnshoreGridCables, showOnshorePowerlines, showOnshoreWindfarms,showWorkingGroups, p);
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

function getEntity(installations, pipelines, windfarms, areas, wells, wrecks, basins, fields, onshoreGasPipes,onshoreGasSites,onshoreGridCables,onshorePowerlines,onshoreWindfarms,workingGroups, eType, eId) {
    switch (eType) {
        case "Installation": return installations.get(eId);
        case "Pipeline": return pipelines.get(eId);
        case "Windfarm": return windfarms.get(eId);
        case "Area": return areas.get(eId);
        case "WorkingGroup": return workingGroups.get(eId);
        case "Basin": return basins.get(eId);
        case "Well": return wells.get(eId);
        case "Wreck": return wrecks.get(eId);
        case "Field": return fields.get(eId);
        case "OnshoreGasPipe": return onshoreGasPipes.get(eId);
        case "OnshoreGasSite": return onshoreGasSites.get(eId);
        case "OnshoreGridCable": return onshoreGridCables.get(eId);
        case "OnshorePowerline": return onshorePowerlines.get(eId);
        case "OnshoreWindfarm":  return onshoreWindfarms.get(eId);
        case "DecomYard":
        default:
            return null;
    }
}

function choosePanel(installations, wells, areas, pipelines, fields, eType, entity) {
    if (!entity) {
        const northSea = { name: "North Sea" };
        return <AreaInfoPanel installations={installations} area={northSea} />;
    } else if (entity.InfoPanel) {
        return <DataDriveInfoPanel entity={entity} installations={installations} wells={wells} pipelines={pipelines} fields={fields} name={entity.name} image={entity.ImageID} epm={entity.ePMID} type={eType} details={entity.InfoPanel} />
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

function InstallationInfo({ installations, searchParams }) {
    const search = new URLSearchParams(searchParams);
    const installationTypes = groupByAndSort(installations, installation => installation.Type);

    const installationTypeEntries = [];

    installationTypes.forEach((value, key) => {
        search.set("type", key);
        installationTypeEntries.push(<Entry key={key} type="link" link={{ pathname: "installations", search: search.toString() }} title={key} subtitle={value.length.toLocaleString()} borderBottom></Entry>);
    });
    search.delete("type");

    return (
        <EntryContainer title="Installations" subtitle={installations.length.toLocaleString()} type="link" link={{ pathname: "installations", search: search.toString() }} open={false} borderBottom>
            {installationTypeEntries}
        </EntryContainer>);
}

function WellInfo({ wells, searchParams }) {
    const search = new URLSearchParams(searchParams);
    const wellStatus = groupByAndSort(wells, well => well["Well Status"]);

    const wellStatusEntries = [];

    wellStatus.forEach((value, key) => {
        search.set("wellStatus", key);
        wellStatusEntries.push(<Entry key={key} type="link" link={{ pathname: "wells", search: search.toString() }} title={key} subtitle={value.length.toLocaleString()} borderBottom></Entry>);
    });
    search.delete("wellStatus");

    return (
        <EntryContainer title="Wells" subtitle={wells.length.toLocaleString()} type="link" link={{ pathname: "wells", search: search.toString() }} open={false} borderBottom>
            {wellStatusEntries}
        </EntryContainer>);
}

function FieldInfo({ fields, searchParams }) {
    const search = new URLSearchParams(searchParams);
    const fieldStatus = groupByAndSort(fields, field => field["Field Status"]);

    const fieldStatusEntries = [];

    fieldStatus.forEach((value, key) => {
        search.set("fieldStatus", key);
        fieldStatusEntries.push(<Entry key={key} type="link" link={{ pathname: "fields", search: search.toString() }} title={key} subtitle={value.length.toLocaleString()} borderBottom></Entry>);
    });
    search.delete("fieldStatus");

    return (
        <EntryContainer title="Fields" subtitle={fields.length.toLocaleString()} type="link" link={{ pathname: "fields", search: search.toString() }} open={false} borderBottom>
            {fieldStatusEntries}
        </EntryContainer>);
}

function PipelineInfo({ pipelines, searchParams }) {
    const search = new URLSearchParams(searchParams);
    const pipelineTypes = groupByAndSort(pipelines, pipeline => pipeline.inst_type);

    const pipelineTypeEntries = [];

    pipelineTypes.forEach((value, key) => {
        search.set("instType", key);
        pipelineTypeEntries.push(<Entry key={key} type="link" link={{ pathname: "pipelines", search: search.toString() }} title={key} subtitle={value.length.toLocaleString()} borderBottom></Entry>);
    });
    search.delete("instType");

    return (
        <EntryContainer title="Pipelines" subtitle={pipelines.length.toLocaleString()} type="link" link={{ pathname: "pipelines", search: search.toString() }} open={false} borderBottom>
            {pipelineTypeEntries}
        </EntryContainer>);
}

function AreaInfo({ area, installations, wells, pipelines, fields }) {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete("basinId");
    searchParams.delete("workingGroupId");
    searchParams.set("areaId", area.id);
    const installationsInArea = [...installations.values()].filter(installation => area.id === installation.areaId);
    const wellsInArea = [...wells.values()].filter(well => area.id === well.areaId);
    const pipelinesInArea = [...pipelines.values()].filter(pipeline => pipeline.areaIds.includes(area.id));
    const fieldsInArea = [...fields.values()].filter(field => field.areaId === area.id);
    return (
        <>
            <InstallationInfo installations={installationsInArea} searchParams={searchParams} />
            <WellInfo wells={wellsInArea} searchParams={searchParams} />
            <PipelineInfo pipelines={pipelinesInArea} searchParams={searchParams} />
            <FieldInfo fields={fieldsInArea} searchParams={searchParams} />
        </>
    )
}

function BasinInfo({ basin, installations, wells, pipelines, fields }) {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const installationsInBasin = [...installations.values()].filter(installation => basin.id === installation.basinId);
    const wellsInBasin = [...wells.values()].filter(well => basin.id === well.basinId);
    const pipelinesInBasin = [...pipelines.values()].filter(pipeline => pipeline.basinIds.includes(basin.id));
    const fieldsInBasin = [...fields.values()].filter(field => field.basinId === basin.id);
    searchParams.set("basinId", basin.id);
    searchParams.delete("areaId");
    searchParams.delete("workingGroupId");
    return (
        <>
            <InstallationInfo installations={installationsInBasin} searchParams={searchParams} />
            <WellInfo wells={wellsInBasin} searchParams={searchParams} />
            <PipelineInfo pipelines={pipelinesInBasin} searchParams={searchParams} />
            <FieldInfo fields={fieldsInBasin} searchParams={searchParams} />
        </>
    )
}

function WorkingGroupInfo({ workingGroup, installations, wells, pipelines, fields }) {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const installationsInBasin = [...installations.values()].filter(installation => workingGroup.id === installation.workingroupId);
    const wellsInBasin = [...wells.values()].filter(well => workingGroup.id === well.workingroupId);
    const pipelinesInBasin = [...pipelines.values()].filter(pipeline => pipeline.workingroupIds.includes(workingGroup.id));
    const fieldsInBasin = [...fields.values()].filter(field => field.basinId === workingGroup.id);
    searchParams.set("workingGroupId", workingGroup.id);
    searchParams.delete("areaId");
    searchParams.delete("basinId");
    return (
        <>
            <InstallationInfo installations={installationsInBasin} searchParams={searchParams} />
            <WellInfo wells={wellsInBasin} searchParams={searchParams} />
            <PipelineInfo pipelines={pipelinesInBasin} searchParams={searchParams} />
            <FieldInfo fields={fieldsInBasin} searchParams={searchParams} />
        </>
    )
}

function TypeSepcificInfo({ type, entity, installations, wells, pipelines, fields }) {
    switch (type) {
        case "Area": return <AreaInfo installations={installations} wells={wells} pipelines={pipelines} fields={fields} area={entity} />;
        case "Basin": return <BasinInfo installations={installations} wells={wells} pipelines={pipelines} fields={fields} basin={entity} />;
        case "WorkingGroup": return <WorkingGroupInfo installations={installations} wells={wells} pipelines={pipelines} fields={fields} workingGroup={entity} />;
        default: return null;
    }
}


function DataDriveInfoPanel({ name, type, details, image, epm, entity, installations, wells, pipelines, fields }) {
    return (
        <div>
            <TitleBar title={name} subtitle={type} image={image} epm={epm} />
            <TypeSepcificInfo type={type} installations={installations} entity={entity} wells={wells} pipelines={pipelines} fields={fields} />
            {details.map((d) => (<EntryContainer key={d.name} title={d.name} subtitle={d.value} open={d.expaned ?? false} borderBottom>
                {d.values.map((v, i) => (<Entry key={`${v.name}${i}`} title={v.name} subtitle={v.values ?? v.value} type={v.type} borderBottom />))}
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
    const [{ installations, pipelines, windfarms, areas, wells, wrecks, basins, fields,onshoreGasPipes,onshoreGasSites,onshoreGridCables,onshorePowerlines,onshoreWindfarms, workingGroups }, dispatch] = useStateValue();
    const location = useLocation();
    const [isVisible, setIsVisible] = useState(true);
    const search = new URLSearchParams(location.search);
    const eid = search.get("eid");
    const etype = search.get("etype");

    let entity = getEntity(installations, pipelines, windfarms, areas, wells, wrecks, basins, fields,onshoreGasPipes,onshoreGasSites,onshoreGridCables,onshorePowerlines,onshoreWindfarms,workingGroups, etype, eid);
    let panel = choosePanel(installations, wells, areas, pipelines, fields, etype, entity);

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
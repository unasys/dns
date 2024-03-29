import React, { useState, } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useStateValue } from '../../utils/state';
//import InstallationInfoPanel from './InstallationInfoPanel';
import AreaInfoPanel from './AreaInfoPanel';
import './Panels.scss'
import Handle from '../handle/Handle';
import EntryContainer from './EntryContainer';
import Entry from './Entry';
import TitleBar from './TitleBar';
import Slider from 'rc-slider';
import { groupByAndSort } from '../../utils/utils';

function radiusEntryIsClickable(showInstallations, showPipelines,showCCPipelines, showWindfarms, showDecomYards, showFields,showCCFields, showCCSites, showBlocks, showSubsurfaces, showWells, showWrecks, showAreas, showBasins, showOnshoreGasPipes, showOnshoreGasSites, showOnshoreGridCables, showOnshorePowerlines, showOnshoreWindfarms,showWorkingGroups, showOffshoreCables, collection) {
    switch (collection) {
        case "Installation": return showInstallations
        case "Pipeline": return showPipelines
        case "CCPipeline": return showCCPipelines
        case "Windfarm": return showWindfarms
        case "Area": return showAreas;
        case "Basin": return showBasins;
        case "Field": return showFields;
        case "CCField": return showCCFields;
        case "CCSite": return showCCSites;
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
        case "OffshoreCable": return showOffshoreCables;
        default:
            return false;
    }
}

function WithInDistance() {
    const [{ withInDistance, showInstallations, showPipelines, showCCPipelines,showWindfarms, showDecomYards, showFields,showCCFields, showCCSites, showBlocks, showSubsurfaces, showWells, showWrecks, showAreas, showBasins,showOnshoreGasPipes, showOnshoreGasSites, showOnshoreGridCables, showOnshorePowerlines, showOnshoreWindfarms, showWorkingGroups, showOffshoreCables },] = useStateValue();
    const output = [];
    for (const p in withInDistance) {
        const entities = withInDistance[p];
        output.push(<EntryContainer open={false} key={`${p}`} title={`${p}  (${entities.length.toLocaleString()})`} borderBottom>
            {entities.map(e => {
                const isClickable = radiusEntryIsClickable(showInstallations, showPipelines,showCCPipelines, showWindfarms, showDecomYards, showFields, showCCFields, showCCSites, showBlocks, showSubsurfaces, showWells, showWrecks, showAreas, showBasins,showOnshoreGasPipes, showOnshoreGasSites, showOnshoreGridCables, showOnshorePowerlines, showOnshoreWindfarms,showWorkingGroups, showOffshoreCables, p);
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

function getEntity(installations, pipelines,ccpipelines, windfarms, areas, wells, wrecks, basins, fields,ccfields, ccsites, onshoreGasPipes,onshoreGasSites,onshoreGridCables,onshorePowerlines,onshoreWindfarms,workingGroups,blocks, offshoreCables, eType, eId) {
    switch (eType) {
        case "Installation": return installations.get(eId);
        case "Pipeline": return pipelines.get(eId);
        case "CCPipeline": return ccpipelines.get(eId);
        case "Windfarm": return windfarms.get(eId);
        case "Area": return areas.get(eId);
        case "WorkingGroup": return workingGroups.get(eId);
        case "Basin": return basins.get(eId);
        case "Well": return wells.get(eId);
        case "Wreck": return wrecks.get(eId);
        case "Field": return fields.get(eId);
        case "CCField": return ccfields.get(eId);
        case "CCSite": return ccsites.get(eId);
        case "OnshoreGasPipe": return onshoreGasPipes.get(eId);
        case "OnshoreGasSite": return onshoreGasSites.get(eId);
        case "OnshoreGridCable": return onshoreGridCables.get(eId);
        case "OnshorePowerline": return onshorePowerlines.get(eId);
        case "OnshoreWindfarm":  return onshoreWindfarms.get(eId);
        case "Block": return blocks.get(eId);
        case "OffshoreCable": return offshoreCables.get(eId);
        default:
            return null;
    }
}

function choosePanel(installations, wells, areas, pipelines,ccpipelines, fields,ccfields, ccsites, offshoreCables, eType, entity) {
    if (!entity) {
        const northSea = { name: "North Sea" };
        return <AreaInfoPanel installations={installations} area={northSea} />;
    } else if (entity.InfoPanel) {
        return <DataDriveInfoPanel entity={entity} offshoreCables={offshoreCables} installations={installations} wells={wells} pipelines={pipelines} ccpipelines={ccpipelines} fields={fields} ccfields={ccfields} ccsites={ccsites}  name={entity.name} image={entity.ImageID} epm={entity.ePMID} type={eType} details={entity.InfoPanel} />
    } else {
        switch (eType) {
            // case "Installation": return <InstallationInfoPanel installation={entity} />;
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
        console.log(value.length.toLocaleString(), key);
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
    searchParams.delete("installationId");
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
    searchParams.delete("installationId");
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
    const installationsInWG = [...installations.values()].filter(installation => workingGroup.id === installation.workingGroupId);
    const wellsInWG = [...wells.values()].filter(well => workingGroup.id === well.workingGroupId);
    const pipelinesInWG = [...pipelines.values()].filter(pipeline => pipeline.workingGroupId===workingGroup.id);
    const fieldsInWG = [...fields.values()].filter(field => field.workingGroupId === workingGroup.id);
    searchParams.set("workingGroupId", workingGroup.id);
    searchParams.delete("installationId");
    searchParams.delete("areaId");
    searchParams.delete("basinId");
    return (
        <>
            <InstallationInfo installations={installationsInWG} searchParams={searchParams} />
            <WellInfo wells={wellsInWG} searchParams={searchParams} />
            <PipelineInfo pipelines={pipelinesInWG} searchParams={searchParams} />
            <FieldInfo fields={fieldsInWG} searchParams={searchParams} />
        </>
    )
}

function InstallationPanelInfo({ installation, pipelines, }) {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const pipelinesInWG = [...pipelines.values()].filter(pipeline => pipeline.installationId===installation.id);
    searchParams.set("installationId", installation.id);
    searchParams.delete("workingGroupId");
    searchParams.delete("areaId");
    searchParams.delete("basinId");
    return (
        <>
            <PipelineInfo pipelines={pipelinesInWG} searchParams={searchParams} />
        </>
    )
}

function TypeSepcificInfo({ type, entity, installations, wells, pipelines, fields }) {
    switch (type) {
        case "Installation": return <InstallationPanelInfo installations={installations} wells={wells} pipelines={pipelines} fields={fields} installation={entity} />;
        case "Area": return <AreaInfo installations={installations} wells={wells} pipelines={pipelines} fields={fields} area={entity} />;
        case "Basin": return <BasinInfo installations={installations} wells={wells} pipelines={pipelines} fields={fields} basin={entity} />;
        case "WorkingGroup": return <WorkingGroupInfo installations={installations} wells={wells} pipelines={pipelines} fields={fields} workingGroup={entity} />;
        default: return null;
    }
}


function DataDriveInfoPanel({ name, type, details, image, epm, entity, installations, wells, pipelines, ccpipelines, fields,ccfields, ccsites, workinGroups }) {
    return (
        <div>
            <TitleBar title={name} subtitle={type} image={image} epm={epm} />
            <TypeSepcificInfo type={type} installations={installations} entity={entity} wells={wells} pipelines={pipelines} fields={fields} workinGroups={workinGroups} />
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
    const [{withInDistance, installations, pipelines,ccpipelines, blocks, windfarms, areas, wells, wrecks, basins, fields,ccfields,ccsites,onshoreGasPipes,onshoreGasSites,onshoreGridCables,onshorePowerlines,onshoreWindfarms, workingGroups, offshoreCables, radiusEnabled }, dispatch] = useStateValue();
    const location = useLocation();
    const [isVisible, setIsVisible] = useState(true);
    const search = new URLSearchParams(location.search);
    const eid = search.get("eid");
    const etype = search.get("etype");

    const hasWithInDistance =Object.keys(withInDistance).map(key => withInDistance[key]?.length??0).reduce((a, b) => a + b, 0);
    
    let entity = getEntity(installations, pipelines,ccpipelines, windfarms, areas, wells, wrecks, basins, fields,ccfields,ccsites,onshoreGasPipes,onshoreGasSites,onshoreGridCables,onshorePowerlines,onshoreWindfarms,workingGroups, blocks, offshoreCables, etype, eid);
    let panel = choosePanel(installations, wells, areas, pipelines, ccpipelines, fields,ccfields,ccsites, offshoreCables, etype, entity);
    return (
        panel &&
        <div className="dns-panel right">
            <Handle onHandleClick={() => setIsVisible(!isVisible)} isFacingLeft={false} isOpen={isVisible} />
            <div className={isVisible ? "dns-split" : "dns-split hidden"}>
                <aside className={`sidePanel ${hasWithInDistance?"":"emptyWithIn"}`}>
                    <div className="dns-content">
                        {panel}
                    </div>
                </aside>
                <aside className={`nearby ${hasWithInDistance?"":"empty"}`}>
                    <div className="dns-content">
                        <div className="radius">
                            <svg className="radius-button" viewBox="0 0 10 10" width="60px" onClick={() => dispatch({ type: "clearWithIn" })}>
                                <circle cx="5" cy="5" r="4" strokeWidth="1.5" stroke="#fff" fill="#fff" fillOpacity="0.0" />
                                <circle cx="5" cy="5" r="2" fill="#61626c" />
                            </svg>
                            {radiusEnabled && <Slider min={0} max={30} marks={marks} defaultValue={10} onChange={e => dispatch({ type: "changeRadius", radius: e })}
                                railStyle={{ backgroundColor: '#61626c' }}
                                trackStyle={{ backgroundColor: '#fff' }}
                                dotStyle={{ display: 'none' }}
                                activeDotStyle={{ display: 'none' }}
                                handleStyle={{
                                    borderColor: '#fff',
                                    backgroundColor: 'green'
                                }}></Slider>}
                                 {radiusEnabled && <p className="is-size-6">km</p>}
                        </div>
                        {radiusEnabled && <WithInDistance />}
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default InfoPanel;
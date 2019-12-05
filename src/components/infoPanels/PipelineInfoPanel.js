import React from 'react';
import './Panels.scss';
import TitleBar from './TitleBar';
import EntryContainer from './EntryContainer';
import Entry from './Entry';

function PipelineInfoPanel(props) {
    if (!props.pipeline) return <div>Pipeline not supported.</div>;

    let pipelineDetails = props.pipeline;
    let pipelineName = pipelineDetails["Pipeline Name"];
    let pipelineDTINo = pipelineDetails["Pipeline DTI No"];
    let pipelineDTINoChild = pipelineDetails["Pipeline DTI No Child"];
    let description = pipelineDetails["Description"];
    let fluidConveyed = pipelineDetails["Fluid Conveyed"];
    let fluidConveyedSub = pipelineDetails["Fluid Function"];
    let operator = pipelineDetails["Operator"];
    let status = pipelineDetails["Status"];
    let from = pipelineDetails["Pipeline From"];
    let to = pipelineDetails["Pipeline To"];
    let instType = pipelineDetails["Inst Type"];
    let instTypeSub = pipelineDetails["Inst Type Sub"];

    let xLong = pipelineDetails["X Long"];
    let yLat = pipelineDetails["Y Lat"];
    let latLong;
    if(yLat && xLong){
        latLong = `${yLat}/${xLong}`;
    }
    let untrenched = pipelineDetails["Untrenched Flag"];
    let trenched = "-"
    if(untrenched === "Y"){
        trenched = "N";
    } else if(untrenched === "N"){
        trenched = "Y";
    }
    let area = pipelineDetails["Area"];
    let subArea = pipelineDetails["Sub area"];
    let basin = pipelineDetails["Basin"];
    let quadrant = pipelineDetails["Quadrant"];
    let block = pipelineDetails["Block"];
    let field = pipelineDetails["Field"];

    let titleBar = (
        <TitleBar
            title={pipelineName} subtitle={description}>
        </TitleBar>
    )

    let doubleWidth = (
        <>
            <EntryContainer title="Description" borderBottom>
                <Entry title="Pipeline Number" subtitle={pipelineDTINo}></Entry>
                <Entry title="Pipeline Number Child" subtitle={pipelineDTINoChild}></Entry>
                <Entry title="Fluid Conveyed" subtitle={fluidConveyed}></Entry>
                <Entry title="Fluid Function" subtitle={fluidConveyedSub}></Entry>
                <Entry title="Type" subtitle={instType}></Entry>
                <Entry title="SubType" subtitle={instTypeSub}></Entry>
                <Entry title="Description" subtitle={description}></Entry>
            </EntryContainer>

            <EntryContainer title="Properties" borderBottom>
                <Entry title="Status" subtitle={status}></Entry>
                <Entry title="Trenched" subtitle={trenched}></Entry>
                <Entry title="Operator" subtitle={operator}></Entry>
            </EntryContainer>
            <EntryContainer title="Location" borderBottom>
                <Entry title="From" subtitle={from}></Entry>
                <Entry title="To" subtitle={to}></Entry>
                <Entry title="Lat/Long" subtitle={latLong}></Entry>
                <Entry title="Area" subtitle={area}></Entry>
                <Entry title="Basin" subtitle={basin}></Entry>
                <Entry title="Sub area" subtitle={subArea}></Entry>
                <Entry title="Quadrant" subtitle={quadrant}></Entry>
                <Entry title="Block" subtitle={block}></Entry>
                <Entry title="Field" subtitle={field}></Entry>
            </EntryContainer>
            }
        </>
    )

    let content = (
        <div>
            {titleBar}
            {doubleWidth}
        </div>
    )

    return (
        content
    );
}

export default PipelineInfoPanel;

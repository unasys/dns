import React from 'react';
import './Panels.scss';
import TitleBar from './TitleBar';
import EntryContainer from './EntryContainer';
import Entry from './Entry';

function PipelineInfoPanel(props) {
    if (!props.pipeline) return <div>Pipeline not supported.</div>;

    let pipelineDetails = props.pipeline;
    let pipelineName = pipelineDetails["Pipeline Name"];
    let description = pipelineDetails["Description"];
    let fluidConveyed = pipelineDetails["Fluid Conveyed"];
    let operator = pipelineDetails["Operator"];
    let status = pipelineDetails["Status"];
    let from = pipelineDetails["Pipeline From"];
    let to = pipelineDetails["Pipeline To"];

    let comments = pipelineDetails["QC Comments"];


    let titleBar = (
        <TitleBar
            title={pipelineName} subtitle={description}>
        </TitleBar>
    )

    let doubleWidth = (
        <>
            <EntryContainer borderBottom>
                <Entry title={"Fluid Conveyed"} subtitle={fluidConveyed}></Entry>
                <Entry title={"Operator"} subtitle={operator}></Entry>
                <Entry title={"Status"} subtitle={status}></Entry>
                <Entry title={"From"} subtitle={from}></Entry>
                <Entry title={"To"} subtitle={to}></Entry>
            </EntryContainer>
            {comments && <EntryContainer borderBottom>
                <Entry title={"Comments"} subtitle={comments}></Entry>
            </EntryContainer>}
        </>
    )

    let content = (
        <div style={{ margin: '10px', display: 'flex', flexDirection: 'column' }}>
            {titleBar}
            {doubleWidth}
        </div>
    )

    return (
        content
    );
}

export default PipelineInfoPanel;

import React from 'react';
import '../Panels.scss';
import TitleBar from '../keane-screen/TitleBar';
import EntryContainer from '../keane-screen/EntryContainer';
import Entry from '../keane-screen/Entry';

function PipelineKeaneScreen(props) {
        if (!props.pipelineDetails) return <div>Pipeline not supported.</div>;

        let pipelineDetails = props.pipelineDetails;
        let pipelineName = pipelineDetails["Pipeline Name"];
        let description = pipelineDetails["Description"];
        let fluidConveyed = pipelineDetails["Fluid Conveyed"];
        let operator = pipelineDetails["Operator"];
        let status = pipelineDetails["Status"];

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
            </EntryContainer>
            {comments && <EntryContainer borderBottom>
                <Entry title={"Comments"} subtitle={comments}></Entry>
            </EntryContainer>}
            </>
        )

        let content = (
            <div style={{margin:'10px', display:'flex', flexDirection:'column'}}>
                {titleBar}
                {doubleWidth}
            </div>
            )

        return (
            content
        );
    }

export default PipelineKeaneScreen;

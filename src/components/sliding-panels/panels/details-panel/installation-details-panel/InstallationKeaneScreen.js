import React, { useState } from 'react';
import '../../Panels.scss';
import ConfigInstallationDetailsPanel from '../ConfigInstallationDetailsPanel';
import TitleBar from '../../keane-screen/TitleBar';
import EntryContainer from '../../keane-screen/EntryContainer';
import Entry from '../../keane-screen/Entry';
import Timeline from '../../../../visuals/timeline/Timeline';

function formatToAmericanDate(dateStr) {
    const date = new Date(dateStr);
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
  
    return month + '/' + day + '/' + year;
}

function InstallationKeaneScreen(props) {
        let titleBar = (
            <TitleBar 
                title={props.installationDetails && props.installationDetails.Name} 
                subtitle={"Operator " + (props.installationDetails && props.installationDetails.Operator)}
                installationtype={props.installationDetails && props.installationDetails.FieldType}>
            </TitleBar>
        )

        let doubleWidth = (
            <>
            <EntryContainer>
                <Entry title={"Description"} subtitle={props.installationDetails && props.installationDetails.Description} borderBottom></Entry>
                <Entry title={"Age"} subtitle={props.installationDetails && props.installationDetails.Age + " years"} borderBottom></Entry>
            </EntryContainer>
            <EntryContainer borderBottom>
                <Entry title={"Installation Type"} subtitle={props.installationDetails && props.installationDetails.Type}></Entry>
                <Entry title={"Subsea Tieback"} subtitle={"-"}></Entry>
            </EntryContainer>
            <EntryContainer>
                <Entry icon={<i className="fas fa-dumbbell" style={{fontSize:'20px'}}></i>} title={"Weight Topside"} subtitle={props.installationDetails && props.installationDetails.TopsideWeight + "te"} borderBottom></Entry>
                <Entry title={"Weight substructure"} subtitle={props.installationDetails && props.installationDetails.SubStructureWeight + "te"} borderBottom></Entry>
            </EntryContainer>
            <EntryContainer borderBottom>
                <Entry title={"Production wells"} subtitle={"-"}></Entry>
                <Entry title={"Water injection wells"} subtitle={"-"}></Entry>
            </EntryContainer>
            <EntryContainer borderBottom>
                <Entry icon={<i class="fas fa-dot-circle"></i>} title={"Manned"}></Entry>
                <Entry icon={<i className="fas fa-cog"></i>} title={props.installationDetails && props.installationDetails.Status }></Entry>
                <Entry icon={<i className="fas fa-male"></i>} title={"POB"} subtitle={props.installationDetails && props.installationDetails.PersonsOnBoard}></Entry>
            </EntryContainer>
            <EntryContainer>
                <Entry icon={<i className="fas fa-map-marker"></i>} title={"Location"} subtitle={props.installationDetails && props.installationDetails.Area}></Entry>
            </EntryContainer>
            </>
        )

        let timeLineDates = [];
        if (props.installationDetails) {
            if (props.installationDetails.StartDate) { 
                timeLineDates.push(formatToAmericanDate(props.installationDetails.StartDate))
            }
            
            if (props.installationDetails.PlannedCOP) {
                timeLineDates.push(formatToAmericanDate(props.installationDetails.PlannedCOP))  
            } 
        }

        let timeLine = (
            <Timeline values={timeLineDates}></Timeline>
        )

        let content;
        if (props.installationDetails && props.installationDetails.DetailsPanel) {
            content =
                <>
                {titleBar}
                <ConfigInstallationDetailsPanel
                    installationDetails={props.installationDetails.DetailsPanel}
                    projectId={props.projectId}>
                </ConfigInstallationDetailsPanel>
                </>
        } else {
            content = 
            <div style={{margin:'10px', display:'flex', flexDirection:'column'}}>
                {titleBar}
                {doubleWidth}
                {props.installationDetails && props.installationDetails.ImageID ? <img style={{alignSelf:'center', maxWidth:'300px'}} src={`https://assets.digitalnorthsea.com/images/installations/${props.installationDetails.ImageID}`} alt="overview-thumbnail" ></img> : <img style={{alignSelf:'center', maxWidth:'300px'}} src={`https://assets.digitalnorthsea.com/images/installations/-1.jpg`} alt="overview-thumbnail" ></img>}
                {timeLine}
            </div>
        }

        return (
            content
        );
    }

export default InstallationKeaneScreen;

import React, { useState } from 'react';
import '../../Panels.scss';
import ConfigInstallationDetailsPanel from '../ConfigInstallationDetailsPanel';
import TitleBar from '../../keane-screen/TitleBar';
import EntryContainer from '../../keane-screen/EntryContainer';
import Entry from '../../keane-screen/Entry';
import SketchfabViewer from '../../../../visuals/sketchfab-viewer/SketchfabViewer';

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

function getAreaModelId(areaName) {
    switch (areaName) {
        case "North Sea": {
            return "3667f046fdd84437a86404e58af37134";
        }
        case "East of Shetland": {
            return "4fb208944bab4cf995c4c71958f86d71";
        }
        case "Morcambe Bay": {
            return "2da22177e7884d4b95c680d9d0132bdb";
        }
        case "Moray Firth": {
            return null;
        }
        case "Northern North Sea": {
            return null;
        }
        case "Southern North Sea": {
            return "df135c854ced45a1b74fa9940f3316a0";
        }
        case "West of Shetland": {
            return null;
        }
    }
}

function getAreaRealisticModelId(areaName) {
    switch (areaName) {
        case "East of Shetland": {
            return "5dc86fb5edaa473cbcc594bc6b4f6889";
        }

        default: return null;
    }
}

function AreaKeaneScreen(props) {
        if (!props.areaDetails) return <div>Area not supported.</div>;

        let areaName = props.areaDetails.name;
        let areaCode = props.areaDetails.areaCode;

        let titleBar = (
            <TitleBar 
                title={areaName}>
            </TitleBar>
        )

        let numberOfInstallations;
        let averageAge; 
        let installationsInArea;
        let installationTypes;

        if (areaName !== "North Sea") {
            installationsInArea = props.allInstallations.filter(installation => areaCode === installation.Area)
        }  else {
            installationsInArea = props.allInstallations;
        }

        numberOfInstallations = installationsInArea.length
        averageAge = installationsInArea.map(installation => installation.Age).reduce((acc, age) => age + acc, 0) / installationsInArea.length;
        installationTypes = groupBy(installationsInArea, installation => installation.Type);

        let installationTypeEntries = [];

        installationTypes.forEach((value, key) => {
            installationTypeEntries.push(<Entry title={key} subtitle={value.length} borderBottom></Entry>);
        })


        var dateNow = new Date();
        var year = dateNow.getFullYear();
        var month = dateNow.getMonth();
        var day = dateNow.getDate();
        var next5Years = new Date(year + 5, month, day);
        var last5Years = new Date(year -5, month, day);
    
        let decomNext5Years = installationsInArea.filter(installation => { 
            let plannedCOP = new Date(installation.PlannedCOP);
            return plannedCOP > dateNow && plannedCOP < next5Years;
        }).length

        let installedLast5Years = installationsInArea.filter(installation => {
            let startDate = new Date(installation.StartDate);
            return startDate > last5Years;
        }).length

        let weightInArea = installationsInArea.reduce((acc, installation) => {
            return acc + installation.TopsideWeight + installation.SubStructureWeight
        }, 0)

        let averageWaterDepth = installationsInArea.reduce((acc, installation) => acc + installation.WaterDepth, 0) / installationsInArea.length 
        let maxWaterDepth = Math.max(...installationsInArea.map(installation => installation.WaterDepth));

        let doubleWidth = (
            <>
            <EntryContainer borderBottom>
                <Entry title={"Installations"} subtitle={numberOfInstallations}></Entry>
                <Entry title={"Avg Age"} subtitle={Math.round(averageAge) + " years"}></Entry>
            </EntryContainer>
            <EntryContainer borderBottom>
              {installationTypeEntries}
            </EntryContainer>
            <EntryContainer borderBottom>
                <Entry title={"Decom next 5 years"} subtitle={decomNext5Years}></Entry>
                <Entry title={"Installed last 5 years"} subtitle={installedLast5Years}></Entry>
            </EntryContainer>
            <EntryContainer borderBottom>
                <Entry icon={<i className="fas fa-dumbbell" style={{fontSize:'20px'}}></i>} title={"Total Weight"} subtitle={weightInArea + " te"}></Entry>
            </EntryContainer>
            <EntryContainer borderBottom>
                <Entry title={"Avg Water Depth"} subtitle={Math.round(averageWaterDepth) + "m"}></Entry>
                <Entry title={"Max Water Depth"} subtitle={maxWaterDepth + "m"}></Entry>
            </EntryContainer>
            <EntryContainer>
                <Entry icon={<i className="fas fa-map-marker"></i>} title={"Location"} subtitle={props.installationDetails && props.installationDetails.Area}></Entry>
            </EntryContainer>
            </>
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
                {<div style={{width:'100%', height:'350px', paddingTop:'20px'}}>
                    {getAreaModelId(areaName) && <SketchfabViewer sketchfabId={getAreaModelId(areaName)} isNonAbsolute={true}></SketchfabViewer>}
                </div>}
                {<div style={{width:'100%', height:'350px', paddingTop:'20px'}}>
                    {getAreaRealisticModelId(areaName) && <SketchfabViewer sketchfabId={getAreaRealisticModelId(areaName)} isNonAbsolute={true}></SketchfabViewer>}
                </div>}
            </div>
        }

        return (
            content
        );
    }

export default AreaKeaneScreen;

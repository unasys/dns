import React from 'react';
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

    let doubleWidth = <></>;
    if(props.installationDetails){
    doubleWidth= (
        <>
            <EntryContainer title="Field" borderBottom>
                <Entry title={"Name"} subtitle={props.installationDetails.Fieldname} borderBottom></Entry>
                <Entry title={"Type"} subtitle={props.installationDetails.FieldType} borderBottom></Entry>
            </EntryContainer>
            <EntryContainer title="Operator" borderBottom>
                <Entry title={"Name"} subtitle={props.installationDetails.Operator} borderBottom></Entry>
                <Entry title={"Original Operator"} subtitle={props.installationDetails.OriginalOperator} borderBottom></Entry>
            </EntryContainer>
            <EntryContainer title="Installation" borderBottom>
                <Entry title={"Type"} subtitle={props.installationDetails.Type} borderBottom></Entry>
                <Entry title={"Age"} subtitle={props.installationDetails.Age + " years"} borderBottom></Entry>
                <Entry title={"Design"} subtitle={props.installationDetails.Design} borderBottom></Entry>
                <Entry title={"Builder"} subtitle={props.installationDetails.Builder} borderBottom></Entry>
                <Entry title={"Status Code"} subtitle={props.installationDetails.StatusCode} borderBottom></Entry>
                <Entry title={"Determination"} subtitle={props.installationDetails.Determination} borderBottom></Entry>
                <Entry title={"Condition"} subtitle={props.installationDetails.Condition} borderBottom></Entry>
                <Entry title={"Manned"} subtitle={props.installationDetails.MannedOrNUI} borderBottom></Entry>
                <Entry title={"Viability for Reuse"} subtitle={props.installationDetails.ViabilityForReuse} borderBottom></Entry>
            </EntryContainer>
            <EntryContainer title="Licence" borderBottom>
                <Entry title={"Original Licence1"} subtitle={props.installationDetails.OriginalLicence1} borderBottom></Entry>
                <Entry title={"Original Licence 2"} subtitle={props.installationDetails.OriginalLicence2} borderBottom></Entry>
                <Entry title={"Certifying Authority"} subtitle={props.installationDetails.CertifyingAuthority} borderBottom></Entry>
                <Entry title={"Class Certificate"} subtitle={props.installationDetails.ClassCertificate} borderBottom></Entry>
            </EntryContainer>
            <EntryContainer title="Location" borderBottom>
                <Entry title={"CRS Code"} subtitle={props.installationDetails.CRSCode} borderBottom></Entry>
                <Entry title={"CRS Name"} subtitle={props.installationDetails.CRSName} borderBottom></Entry>
                <Entry title={"Area"} subtitle={props.installationDetails.AreaName} borderBottom></Entry>
                <Entry title={"Basin"} subtitle={props.installationDetails.BasinName} borderBottom></Entry>
                <Entry title={"Hub Area"} subtitle={props.installationDetails.HubArea} borderBottom></Entry>
                <Entry title={"Lat/Long"} subtitle={props.installationDetails.Latitude + " / " + props.installationDetails.Longitude} borderBottom></Entry>
                <Entry title={"Block"} subtitle={props.installationDetails.Block} borderBottom></Entry>
                <Entry title={"Distance from ABZ"} subtitle={props.installationDetails.DistanceFromABZ} borderBottom></Entry>
                <Entry title={"Azimuth"} subtitle={props.installationDetails.DistanceFromABZ} borderBottom></Entry>
            </EntryContainer>
            <EntryContainer title="Emergency" borderBottom>
                <Entry title={"OIM"} subtitle={props.installationDetails.OIM} borderBottom></Entry>
                <Entry title={"Onshore OIM"} subtitle={props.installationDetails.OnshoreOIM} borderBottom></Entry>
                <Entry title={"Tel Offshore"} subtitle={props.installationDetails.TelOffshore} borderBottom></Entry>
                <Entry title={"Tel Onshore"} subtitle={props.installationDetails.TellOnshort} borderBottom></Entry>
                <Entry title={"POB"} subtitle={props.installationDetails.PersonsOnBoard} borderBottom></Entry>
                <Entry title={"VOI"} subtitle={props.installationDetails.VesselOfInterest} borderBottom></Entry>
                <Entry title={"POI"} subtitle={props.installationDetails.PlatformOfInterest} borderBottom></Entry>
                <Entry title={"Call Sign"} subtitle={props.installationDetails.CallSign} borderBottom></Entry>
                <Entry title={"Frequency"} subtitle={props.installationDetails.Frequency} borderBottom></Entry>
                <Entry title={"No of Lifeboats"} subtitle={props.installationDetails.Lifeboats} borderBottom></Entry>
                <Entry title={"Lifeboat Capacity"} subtitle={props.installationDetails.LifeboatCapacity} borderBottom></Entry>
                <Entry title={"Lifeboat Type"} subtitle={props.installationDetails.LifeboatType} borderBottom></Entry>
                <Entry title={"Last Certified"} subtitle={props.installationDetails.LastCertified} borderBottom></Entry>
                <Entry title={"Other Marine Craft"} subtitle={props.installationDetails.OtherMarineCraft} borderBottom></Entry>
                <Entry title={"Stand By Vessels"} subtitle={props.installationDetails.StandbyVessels} borderBottom></Entry>
                <Entry title={"Crane Capacity"} subtitle={props.installationDetails.CraneCapacity} borderBottom></Entry>
                <Entry title={"Crane Type"} subtitle={props.installationDetails.CraneType} borderBottom></Entry>
            </EntryContainer>
            <EntryContainer title="Subsea" borderBottom>
                <Entry title={"Fields"} subtitle={props.installationDetails.Fields} borderBottom></Entry>
                <Entry title={"Wells"} subtitle={props.installationDetails.Wells} borderBottom></Entry>
                <Entry title={"Discovery Well"} subtitle={props.installationDetails.DiscoveryWell} borderBottom></Entry>
                <Entry title={"Discovery Date"} subtitle={props.installationDetails.DiscoveryDate} borderBottom></Entry>
                <Entry title={"Water Depth"} subtitle={props.installationDetails.WaterDepth} borderBottom></Entry>
                <Entry title={"Water Injection Well"} subtitle={props.installationDetails.WaterInjectionWell} borderBottom></Entry>
            </EntryContainer>
            <EntryContainer title="Production" borderBottom>
                <Entry title={"Status"} subtitle={props.installationDetails.Status} borderBottom></Entry>
                <Entry title={"Rate"} subtitle={props.installationDetails.Rate} borderBottom></Entry>
                <Entry title={"Start"} subtitle={props.installationDetails.StartDate} borderBottom></Entry>
                <Entry title={"COP"} subtitle={props.installationDetails.PlannedCOP} borderBottom></Entry>
                <Entry title={"Capacity"} subtitle={props.installationDetails.Capacity} borderBottom></Entry>
                <Entry title={"Pipeline System"} subtitle={props.installationDetails.PipelineSystemName} borderBottom></Entry>
            </EntryContainer>

            <EntryContainer title="Weight" borderBottom>
                <Entry title={"Topsides"} subtitle={props.installationDetails.TopsideWeight} borderBottom></Entry>
                <Entry title={"Displacement"} subtitle={props.installationDetails.Displacement} borderBottom></Entry>
                <Entry title={"Lightship"} subtitle={props.installationDetails.Lightship} borderBottom></Entry>
                <Entry title={"Sub Structure"} subtitle={props.installationDetails.SubStructureWeight} borderBottom></Entry>
                <Entry title={"Subsea"} subtitle={props.installationDetails.SubStructureWeight} borderBottom></Entry>
            </EntryContainer>

            <EntryContainer title="Supply / Consumables" borderBottom>
                <Entry title={"Supply Boats / WK"} subtitle={props.installationDetails.ConsumablesPerWeek} borderBottom></Entry>
                <Entry title={"Operator"} subtitle={props.installationDetails.SupplyOperator} borderBottom></Entry>
                <Entry title={"Water"} subtitle={props.installationDetails.Water} borderBottom></Entry>
                <Entry title={"Fuel"} subtitle={props.installationDetails.Fuel} borderBottom></Entry>
            </EntryContainer>

            <EntryContainer title="Helicopters" borderBottom>
                <Entry title={"Per Week"} subtitle={props.installationDetails.HelicoptersPerWeek} borderBottom></Entry>
                <Entry title={"Operator"} subtitle={props.installationDetails.HelicopterOperator} borderBottom></Entry>
                <Entry title={"Refueling Capability"} subtitle={props.installationDetails.RefuelingCapability} borderBottom></Entry>
            </EntryContainer>

            <EntryContainer title="Power Generation" borderBottom>
                <Entry title={"Capacity"} subtitle={props.installationDetails.PowerGenerationCapacity} borderBottom></Entry>
                <Entry title={"Average / Hour"} subtitle={props.installationDetails.PowerGenerationAverageHour} borderBottom></Entry>
                <Entry title={"Fuel"} subtitle={props.installationDetails.Fuel} borderBottom></Entry>
            </EntryContainer></>)
}
            //  <EntryContainer>
            //     <Entry title={"Description"} subtitle={props.installationDetails && props.installationDetails.Description} borderBottom></Entry>
            //     <Entry title={"Age"} subtitle={props.installationDetails && props.installationDetails.Age + " years"} borderBottom></Entry>
            // </EntryContainer>
            // <EntryContainer borderBottom>
            //     <Entry title={"Installation Type"} subtitle={props.installationDetails && props.installationDetails.Type}></Entry>
            //     <Entry title={"Subsea Tieback"} subtitle={"-"}></Entry>
            // </EntryContainer>
            // <EntryContainer>
            //     <Entry icon={<i className="fas fa-dumbbell" style={{ fontSize: '20px' }}></i>} title={"Weight Topside"} subtitle={props.installationDetails && props.installationDetails.TopsideWeight + "te"} borderBottom></Entry>
            //     <Entry title={"Weight substructure"} subtitle={props.installationDetails && props.installationDetails.SubStructureWeight + "te"} borderBottom></Entry>
            // </EntryContainer>
            // <EntryContainer borderBottom>
            //     <Entry title={"Production wells"} subtitle={"-"}></Entry>
            //     <Entry title={"Water injection wells"} subtitle={"-"}></Entry>
            // </EntryContainer>
            // <EntryContainer borderBottom>
            //     <Entry icon={<i class="fas fa-dot-circle"></i>} title={"Manned"}></Entry>
            //     <Entry icon={<i className="fas fa-cog"></i>} title={props.installationDetails && props.installationDetails.Status}></Entry>
            //     <Entry icon={<i className="fas fa-male"></i>} title={"POB"} subtitle={props.installationDetails && props.installationDetails.PersonsOnBoard}></Entry>
            // </EntryContainer>
            // <EntryContainer>
            //     <Entry icon={<i className="fas fa-map-marker"></i>} title={"Location"} subtitle={props.installationDetails && props.installationDetails.Area}></Entry>
            // </EntryContainer>
        
    

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
            <div style={{ margin: '10px', display: 'flex', flexDirection: 'column' }}>
                {titleBar}
                {doubleWidth}
                {props.installationDetails && props.installationDetails.ImageID ? <img style={{ alignSelf: 'center', maxWidth: '300px' }} src={`https://assets.digitalnorthsea.com/images/installations/${props.installationDetails.ImageID}`} alt="overview-thumbnail" ></img> : <img style={{ alignSelf: 'center', maxWidth: '300px' }} src={`https://assets.digitalnorthsea.com/images/installations/-1.jpg`} alt="overview-thumbnail" ></img>}
                {timeLine}
            </div>
    }

    return (
        content
    );
}

export default InstallationKeaneScreen;

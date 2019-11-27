import React from 'react';
import './Panels.scss';
import TitleBar from './TitleBar';
import EntryContainer from './EntryContainer';
import Entry from './Entry';

function InstallationInfoPanel(props) {
    let titleBar = (
        <TitleBar
            title={props.installation && props.installation.Name}
            subtitle={"Operator " + (props.installation && props.installation.Operator)}
            installationtype={props.installation && props.installation.FieldType}>
        </TitleBar>
    )

    let doubleWidth = <></>;
    if (props.installation) {
        doubleWidth = (
            <>
                <EntryContainer title="Field" borderBottom>
                    <Entry title={"Name"} subtitle={props.installation.Fieldname} borderBottom></Entry>
                    <Entry title={"Type"} subtitle={props.installation.FieldType} borderBottom></Entry>
                </EntryContainer>
                <EntryContainer title="Operator" borderBottom>
                    <Entry title={"Name"} subtitle={props.installation.Operator} borderBottom></Entry>
                    <Entry title={"Original Operator"} subtitle={props.installation.OriginalOperator} borderBottom></Entry>
                </EntryContainer>
                <EntryContainer title="Installation" borderBottom>
                    <Entry title={"Type"} subtitle={props.installation.Type} borderBottom></Entry>
                    <Entry title={"Age"} subtitle={props.installation.Age + " years"} borderBottom></Entry>
                    <Entry title={"Design"} subtitle={props.installation.Design} borderBottom></Entry>
                    <Entry title={"Builder"} subtitle={props.installation.Builder} borderBottom></Entry>
                    <Entry title={"Status Code"} subtitle={props.installation.StatusCode} borderBottom></Entry>
                    <Entry title={"Determination"} subtitle={props.installation.Determination} borderBottom></Entry>
                    <Entry title={"Condition"} subtitle={props.installation.Condition} borderBottom></Entry>
                    <Entry title={"Manned"} subtitle={props.installation.MannedOrNUI} borderBottom></Entry>
                    <Entry title={"Viability for Reuse"} subtitle={props.installation.ViabilityForReuse} borderBottom></Entry>
                </EntryContainer>
                <EntryContainer title="Licence" borderBottom>
                    <Entry title={"Original Licence1"} subtitle={props.installation.OriginalLicence1} borderBottom></Entry>
                    <Entry title={"Original Licence 2"} subtitle={props.installation.OriginalLicence2} borderBottom></Entry>
                    <Entry title={"Certifying Authority"} subtitle={props.installation.CertifyingAuthority} borderBottom></Entry>
                    <Entry title={"Class Certificate"} subtitle={props.installation.ClassCertificate} borderBottom></Entry>
                </EntryContainer>
                <EntryContainer title="Location" borderBottom>
                    <Entry title={"CRS Code"} subtitle={props.installation.CRSCode} borderBottom></Entry>
                    <Entry title={"CRS Name"} subtitle={props.installation.CRSName} borderBottom></Entry>
                    <Entry title={"Area"} subtitle={props.installation.AreaName} borderBottom></Entry>
                    <Entry title={"Basin"} subtitle={props.installation.BasinName} borderBottom></Entry>
                    <Entry title={"Hub Area"} subtitle={props.installation.HubArea} borderBottom></Entry>
                    <Entry title={"Lat/Long"} subtitle={props.installation.Latitude + " / " + props.installation.Longitude} borderBottom></Entry>
                    <Entry title={"Block"} subtitle={props.installation.Block} borderBottom></Entry>
                    <Entry title={"Distance from ABZ"} subtitle={props.installation.DistanceFromABZ} borderBottom></Entry>
                    <Entry title={"Azimuth"} subtitle={props.installation.DistanceFromABZ} borderBottom></Entry>
                </EntryContainer>
                <EntryContainer title="Emergency" borderBottom>
                    <Entry title={"OIM"} subtitle={props.installation.OIM} borderBottom></Entry>
                    <Entry title={"Onshore OIM"} subtitle={props.installation.OnshoreOIM} borderBottom></Entry>
                    <Entry title={"Tel Offshore"} subtitle={props.installation.TelOffshore} borderBottom></Entry>
                    <Entry title={"Tel Onshore"} subtitle={props.installation.TellOnshort} borderBottom></Entry>
                    <Entry title={"POB"} subtitle={props.installation.PersonsOnBoard} borderBottom></Entry>
                    <Entry title={"VOI"} subtitle={props.installation.VesselOfInterest} borderBottom></Entry>
                    <Entry title={"POI"} subtitle={props.installation.PlatformOfInterest} borderBottom></Entry>
                    <Entry title={"Call Sign"} subtitle={props.installation.CallSign} borderBottom></Entry>
                    <Entry title={"Frequency"} subtitle={props.installation.Frequency} borderBottom></Entry>
                    <Entry title={"No of Lifeboats"} subtitle={props.installation.Lifeboats} borderBottom></Entry>
                    <Entry title={"Lifeboat Capacity"} subtitle={props.installation.LifeboatCapacity} borderBottom></Entry>
                    <Entry title={"Lifeboat Type"} subtitle={props.installation.LifeboatType} borderBottom></Entry>
                    <Entry title={"Last Certified"} subtitle={props.installation.LastCertified} borderBottom></Entry>
                    <Entry title={"Other Marine Craft"} subtitle={props.installation.OtherMarineCraft} borderBottom></Entry>
                    <Entry title={"Stand By Vessels"} subtitle={props.installation.StandbyVessels} borderBottom></Entry>
                    <Entry title={"Crane Capacity"} subtitle={props.installation.CraneCapacity} borderBottom></Entry>
                    <Entry title={"Crane Type"} subtitle={props.installation.CraneType} borderBottom></Entry>
                </EntryContainer>
                <EntryContainer title="Subsea" borderBottom>
                    <Entry title={"Fields"} subtitle={props.installation.Fields} borderBottom></Entry>
                    <Entry title={"Wells"} subtitle={props.installation.Wells} borderBottom></Entry>
                    <Entry title={"Discovery Well"} subtitle={props.installation.DiscoveryWell} borderBottom></Entry>
                    <Entry title={"Discovery Date"} subtitle={props.installation.DiscoveryDate} borderBottom></Entry>
                    <Entry title={"Water Depth"} subtitle={props.installation.WaterDepth} borderBottom></Entry>
                    <Entry title={"Water Injection Well"} subtitle={props.installation.WaterInjectionWell} borderBottom></Entry>
                </EntryContainer>
                <EntryContainer title="Production" borderBottom>
                    <Entry title={"Status"} subtitle={props.installation.Status} borderBottom></Entry>
                    <Entry title={"Rate"} subtitle={props.installation.Rate} borderBottom></Entry>
                    <Entry title={"Start"} subtitle={props.installation.StartDate} borderBottom></Entry>
                    <Entry title={"COP"} subtitle={props.installation.PlannedCOP} borderBottom></Entry>
                    <Entry title={"Capacity"} subtitle={props.installation.Capacity} borderBottom></Entry>
                    <Entry title={"Pipeline System"} subtitle={props.installation.PipelineSystemName} borderBottom></Entry>
                </EntryContainer>

                <EntryContainer title="Weight" borderBottom>
                    <Entry title={"Topsides"} subtitle={props.installation.TopsideWeight} borderBottom></Entry>
                    <Entry title={"Displacement"} subtitle={props.installation.Displacement} borderBottom></Entry>
                    <Entry title={"Lightship"} subtitle={props.installation.Lightship} borderBottom></Entry>
                    <Entry title={"Sub Structure"} subtitle={props.installation.SubStructureWeight} borderBottom></Entry>
                    <Entry title={"Subsea"} subtitle={props.installation.SubStructureWeight} borderBottom></Entry>
                </EntryContainer>

                <EntryContainer title="Supply / Consumables" borderBottom>
                    <Entry title={"Supply Boats / WK"} subtitle={props.installation.ConsumablesPerWeek} borderBottom></Entry>
                    <Entry title={"Operator"} subtitle={props.installation.SupplyOperator} borderBottom></Entry>
                    <Entry title={"Water"} subtitle={props.installation.Water} borderBottom></Entry>
                    <Entry title={"Fuel"} subtitle={props.installation.Fuel} borderBottom></Entry>
                </EntryContainer>

                <EntryContainer title="Helicopters" borderBottom>
                    <Entry title={"Per Week"} subtitle={props.installation.HelicoptersPerWeek} borderBottom></Entry>
                    <Entry title={"Operator"} subtitle={props.installation.HelicopterOperator} borderBottom></Entry>
                    <Entry title={"Refueling Capability"} subtitle={props.installation.RefuelingCapability} borderBottom></Entry>
                </EntryContainer>

                <EntryContainer title="Power Generation" borderBottom>
                    <Entry title={"Capacity"} subtitle={props.installation.PowerGenerationCapacity} borderBottom></Entry>
                    <Entry title={"Average / Hour"} subtitle={props.installation.PowerGenerationAverageHour} borderBottom></Entry>
                    <Entry title={"Fuel"} subtitle={props.installation.Fuel} borderBottom></Entry>
                </EntryContainer></>)
    }
    //  <EntryContainer>
    //     <Entry title={"Description"} subtitle={props.installation && props.installation.Description} borderBottom></Entry>
    //     <Entry title={"Age"} subtitle={props.installation && props.installation.Age + " years"} borderBottom></Entry>
    // </EntryContainer>
    // <EntryContainer borderBottom>
    //     <Entry title={"Installation Type"} subtitle={props.installation && props.installation.Type}></Entry>
    //     <Entry title={"Subsea Tieback"} subtitle={"-"}></Entry>
    // </EntryContainer>
    // <EntryContainer>
    //     <Entry icon={<i className="fas fa-dumbbell" style={{ fontSize: '20px' }}></i>} title={"Weight Topside"} subtitle={props.installation && props.installation.TopsideWeight + "te"} borderBottom></Entry>
    //     <Entry title={"Weight substructure"} subtitle={props.installation && props.installation.SubStructureWeight + "te"} borderBottom></Entry>
    // </EntryContainer>
    // <EntryContainer borderBottom>
    //     <Entry title={"Production wells"} subtitle={"-"}></Entry>
    //     <Entry title={"Water injection wells"} subtitle={"-"}></Entry>
    // </EntryContainer>
    // <EntryContainer borderBottom>
    //     <Entry icon={<i class="fas fa-dot-circle"></i>} title={"Manned"}></Entry>
    //     <Entry icon={<i className="fas fa-cog"></i>} title={props.installation && props.installation.Status}></Entry>
    //     <Entry icon={<i className="fas fa-male"></i>} title={"POB"} subtitle={props.installation && props.installation.PersonsOnBoard}></Entry>
    // </EntryContainer>
    // <EntryContainer>
    //     <Entry icon={<i className="fas fa-map-marker"></i>} title={"Location"} subtitle={props.installation && props.installation.Area}></Entry>
    // </EntryContainer>

    return (
        <div style={{ margin: '10px', display: 'flex', flexDirection: 'column' }}>
            {titleBar}
            {doubleWidth}
            {props.installation && props.installation.ImageID ? <img style={{ alignSelf: 'center', maxWidth: '300px' }} src={`https://assets.digitalnorthsea.com/images/installations/${props.installation.ImageID}`} alt="overview-thumbnail" ></img> : <img style={{ alignSelf: 'center', maxWidth: '300px' }} src={`https://assets.digitalnorthsea.com/images/installations/-1.jpg`} alt="overview-thumbnail" ></img>}
        </div>
    );
}

export default InstallationInfoPanel;

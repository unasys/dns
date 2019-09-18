import React, { useState } from 'react';
import './NorthSeaAreaPanel.scss';
import { MapContext } from '../../../../visuals/map/Map';



class NorthSeaAreaPanel extends React.Component {

    constructor(props) {
        super(props);
        this.state = ({
            highlighted: "North Sea"
        })
    }

    areaClicked(area) {
        this.setState({
            highlighted: area.name
        })
        if (area.flyTo) {
            this.context.flyTo(area.flyTo.west, area.flyTo.south, area.flyTo.east, area.flyTo.north, area.flyTo.pitch)
        }
    }

    resultItem(content) { 
        return <div className="area-result-item-container">
            <div className={"area-result-item" + (this.state.highlighted === content.name ? ' highlighted' : '')} onClick={(e) => this.areaClicked(content)}>
                {content.name}
            </div>
        </div>
    }

    render() {
        return (
            <div className="areas">
                {[
                    { name: "North Sea", flyTo: {north: 55.0, east: 6.0, south: 46.0, west: -4.0, pitch: 290}}, 
                    { name: "East of Shetland", flyTo: {north: 58.0, east: 9.0, south: 55.0, west: -10.0, pitch: 295}}, 
                    { name: "Morcambe Bay", flyTo: { north: 54.5, east: -3, south: 50.0, west: -6, pitch: 280}}, 
                    { name: "Northern North Sea",  flyTo: { north: 57, east: 10, south: 55.0, west: -7, pitch: 280}}, 
                    { name: "Central North Sea", flyTo: { north: 55, east: 10, south: 54.0, west: -7, pitch: 280}}, 
                    { name: "Southern North Sea", flyTo: { north: 54.5, east: 4, south: 50.0, west: -1.4, pitch: 280}}, 
                    { name: "West of Shetland", flyTo: {north: 59.0, east: 0, south: 55.0, west: -8.0, pitch: 295}}
                ].map(area => this.resultItem(area))}
            </div>
        )
    }
}
NorthSeaAreaPanel.contextType = MapContext;

export default NorthSeaAreaPanel;
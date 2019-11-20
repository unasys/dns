import React from 'react';
import './NorthSeaAreaPanel.scss';
//import { MapContext } from '../../../../visuals/map/Map';
import { connect } from 'react-redux';
import { setCurrentArea } from '../../../../../actions/areaActions';



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
        this.props.setCurrentArea(area);
    }

    resultItem(content) {
        return <div className="area-result-item-container">
            <div className={"area-result-item" + (this.state.highlighted === content.name ? ' highlighted' : '')} onClick={(e) => this.areaClicked(content)}>
                {content.indented && <i class="fas fa-share" style={{ transform: 'scaleY(-1)', paddingLeft: '10px', paddingRight: '5px' }}></i>}
                {content.name}
            </div>
        </div>
    }


    render() {
        return (
            <div className="areas">
                {[
                    {
                        name: "North Sea",
                        flyTo: { north: 55.0, east: 6.0, south: 42.0, west: -4.0, pitch: -70 },
                        details: {
                            name: "North Sea"
                        }
                    },
                    {
                        name: "Northern North Sea",
                        flyTo: { north: 57, east: 10, south: 55.0, west: -7, pitch: -75 },
                        details: {
                            name: "Northern North Sea",
                            areaCode: "NNS"
                        },
                    },
                    {
                        name: "East of Shetland",
                        indented: true,
                        flyTo: { north: 60.0, east: 7.0, south: 58.0, west: -1.0, pitch: -65 },
                        details: {
                            name: "East of Shetland",
                            areaCode: "EOS"
                        }
                    },
                    {
                        name: "West of Shetland", flyTo: { north: 60.0, east: 0, south: 56.0, west: -7.0, pitch: -75 },
                        details: {
                            name: "West of Shetland",
                            areaCode: "WOS"
                        }
                    },
                    {
                        name: "Moray Firth",
                        flyTo: { north: 58, east: 2, south: 55.0, west: -7, pitch: -75 },
                        details: {
                            name: "Moray Firth",
                            areaCode: "MF"
                        },
                    },
                    {
                        name: "Central North Sea", flyTo: { north: 55, east: 10, south: 54.0, west: -7, pitch: -82 },
                        details: {
                            name: "Central North Sea",
                            areaCode: "CNS"
                        }
                    },
                    {
                        name: "Morcambe Bay",
                        flyTo: { north: 54.5, east: -3, south: 50.0, west: -6, pitch: -80 },
                        details: {
                            name: "Morcambe Bay",
                            areaCode: "IS"
                        }
                    },
                    {
                        name: "Southern North Sea", flyTo: { north: 54.5, east: 4, south: 50.0, west: -1.4, pitch: -80 },
                        details: {
                            name: "Southern North Sea",
                            areaCode: "SNS"
                        }
                    }
                ].map(area => this.resultItem(area))}
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setCurrentArea: (currentArea) => {
            dispatch(setCurrentArea(currentArea))
        }
    }
}

//NorthSeaAreaPanel.contextType = MapContext;

export default connect(null, mapDispatchToProps)(NorthSeaAreaPanel);


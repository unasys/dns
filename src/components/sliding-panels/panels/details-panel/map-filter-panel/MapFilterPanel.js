import React from 'react';
import Switch from 'react-toggle-switch';
import './MapFilterPanel.scss';
import { toggleQuadrants, toggleWells, toggleLicenses, toggleInfrastructure } from '../../../../../actions/bathymetryActions';
import { connect } from 'react-redux';

class MapFilterPanel extends React.Component {

    constructor(props) {
        super(props);
    }
    

    render() {
        let content = (
            <div style={{ display: 'flex' }}>
                <div style={{width:'100%'}}>
                    <div className="panel-title">
                        Layer Visibility
                </div>
                    <div className="layer-container">
                        <div className="layer-content">
                            <div className="bathymetry-title">Quadrants</div>
                            <Switch onClick={this.props.toggleQuadrants} on={this.props.ogaQuadrantsSwitched} className={'bathymetry-title'} />
                        </div>
                    </div>
                    <div className="layer-container">
                        <div className="layer-content">
                            <div className="bathymetry-title">Wells</div>
                            <Switch onClick={() => {}} on={() => {}} className={'bathymetry-title'} />
                        </div>
                    </div>
                    <div className="layer-container">
                        <div className="layer-content">
                            <div className="bathymetry-title">Licenses</div>
                            <Switch onClick={() => {}} on={() => {}} className={'bathymetry-title'} />
                        </div>
                    </div>
                    <div className="layer-container">
                        <div className="layer-content">
                            <div className="bathymetry-title">Pipelines</div>
                            <Switch onClick={() => {}} on={() => {}} className={'bathymetry-title'} />
                        </div>
                    </div>
                </div>
            </div >

        );

        return content
    }
}

function mapDispatchToProps(dispatch) {
    return {
        toggleQuadrants: () => {
            dispatch(toggleQuadrants())
        },
        toggleWells: () => {
            dispatch(toggleWells())
        },
        toggleLicenses: () => {
            dispatch(toggleLicenses())
        },
        toggleInfrastructure: () => {
            dispatch(toggleInfrastructure())
        }
    }
}

function mapStateToProps(state) {
  
    return {
        ogaQuadrantsSwitched: state.BathymetryReducer.ogaQuadrantsSwitched,
        ogaWellsSwitched: state.BathymetryReducer.ogaWellsSwitched,
        ogaLicensesSwitched: state.BathymetryReducer.ogaLicensesSwitched,
        ogaInfrastructureSwitched: state.BathymetryReducer.ogaInfrastructureSwitched,
        coords: state.BathymetryReducer.positions
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapFilterPanel)
import React from 'react';
import Switch from 'react-toggle-switch';
import SlidingPanel from '../../../SlidingPanel';
import './BathymetryLayerPanel.scss';
import { toggleFields, toggleQuadrants, toggleWells, toggleLicenses, toggleInfrastructure } from '../../../../../actions/bathymetryActions';
import { connect } from 'react-redux';
import BathymetryMeasurementPointsPanel from '../bathymetry-measurement-points-panel/BathymetryMeasurementPointsPanel';

class BathymetryLayerPanel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            measurementPointsEmpty: true
        }
        this.setMeasurementPointEmpty = this.setMeasurementPointEmpty.bind(this);
    }

    setMeasurementPointEmpty(isEmpty) {
        this.setState({
            measurementPointsEmpty: isEmpty
        })
    }

    componentDidUpdate(nextProps) {
        if (this.props.coords !== nextProps.coords) {
            this.setMeasurementPointEmpty(nextProps.coords.length === 0);
        }
    }

    render() {
        let panelOneWidth = this.state.measurementPointsEmpty ? '100%' : '50%';
        let content = (
            <div style={{ display: 'flex' }}>
                <div style={{ width: panelOneWidth }}>
                    <div className="panel-title">
                        Layer Visibility
                </div>
                    <div className="layer-container">
                        <div className="layer-content">
                            <div className="bathymetry-title">Fields</div>
                            <Switch onClick={this.props.toggleFields} on={this.props.ogaFieldsSwitched} className={'bathymetry-title'} />
                        </div>
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
                            <Switch onClick={this.props.toggleWells} on={this.props.ogaWellsSwitched} className={'bathymetry-title'} />
                        </div>
                    </div>
                    <div className="layer-container">
                        <div className="layer-content">
                            <div className="bathymetry-title">Licenses</div>
                            <Switch onClick={this.props.toggleLicenses} on={this.props.ogaLicensesSwitched} className={'bathymetry-title'} />
                        </div>
                    </div>
                    <div className="layer-container">
                        <div className="layer-content">
                            <div className="bathymetry-title">Pipelines</div>
                            <Switch onClick={this.props.toggleInfrastructure} on={this.props.ogaInfrastructureSwitched} className={'bathymetry-title'} />
                        </div>
                    </div>
                </div>
                {!this.state.measurementPointsEmpty && <div style={{ width: '50%' }}>
                    <BathymetryMeasurementPointsPanel coords={this.props.coords}></BathymetryMeasurementPointsPanel>
                </div>}
            </div >

        );

        return <SlidingPanel content={content} isSmallWidth={this.state.measurementPointsEmpty}></SlidingPanel>
    }
}

function mapDispatchToProps(dispatch) {
    return {
        toggleFields: () => {
            dispatch(toggleFields())
        },
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
        ogaFieldsSwitched: state.BathymetryReducer.ogaFieldsSwitched,
        ogaQuadrantsSwitched: state.BathymetryReducer.ogaQuadrantsSwitched,
        ogaWellsSwitched: state.BathymetryReducer.ogaWellsSwitched,
        ogaLicensesSwitched: state.BathymetryReducer.ogaLicensesSwitched,
        ogaInfrastructureSwitched: state.BathymetryReducer.ogaInfrastructureSwitched,
        coords: state.BathymetryReducer.positions
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BathymetryLayerPanel)
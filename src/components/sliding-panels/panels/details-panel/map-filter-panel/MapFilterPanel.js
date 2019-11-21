import React from 'react';
import Switch from 'react-toggle-switch';
import './MapFilterPanel.scss';


class MapFilterPanel extends React.Component {

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
                            <div className="bathymetry-title">Pipelines</div>
                            <Switch onClick={this.props.togglePipelines} on={this.props.ogaPipelinesSwitched} className={'bathymetry-title'} />
                        </div>
                    </div>
                    <div className="layer-container">
                        <div className="layer-content">
                            <div className="bathymetry-title">Fields</div>
                            <Switch onClick={this.props.toggleFields} on={this.props.ogaFieldsSwitched} className={'bathymetry-title'} />
                        </div>
                    </div>
                </div>
            </div >

        );

        return content
    }
}



export default MapFilterPanel
import React from 'react';
import './BathymetryMeasurementPointsPanel.scss';

class BathymetryMeasurementPointsPanel extends React.Component {

    calculateDistance(startPoint, endPoint) {
        var endCartographic = window.Cesium.Cartographic.fromCartesian(endPoint);
        var startCartographic = window.Cesium.Cartographic.fromCartesian(startPoint);
        var geodesic = new window.Cesium.EllipsoidGeodesic();
        geodesic.setEndPoints(startCartographic, endCartographic);
        var lengthInMeters = Math.round(geodesic.surfaceDistance);
        return (lengthInMeters / 1000).toFixed(1) + ' km';
    }

    coordsToDegrees(coord) {
        var ellipsoid = window.Cesium.Ellipsoid.WGS84;
        var cartographic = ellipsoid.cartesianToCartographic(coord);

        return { x: window.Cesium.Math.toDegrees(cartographic.latitude).toFixed(7), y: window.Cesium.Math.toDegrees(cartographic.longitude).toFixed(7) };
    }

    coordsWithDistances(coords) {
        let results = [];
        for (var i = 0; i < coords.length; i++) {
            if (coords[i + 1]) {
                results.push({ coords: this.coordsToDegrees(coords[i]), distance: this.calculateDistance(coords[i], coords[i + 1]) });
            } else {
                results.push({ coords: this.coordsToDegrees(coords[i]), distance: null });
            }
        }
        return results;
    }

    render() {
        const coordsWithDistance = this.coordsWithDistances(this.props.coords);
        coordsWithDistance.shift();
        let content = (
            <div className="measurementPointContainer">
                {coordsWithDistance.map((coord, i) =>
                    <span className="pointArrowContainer" key={i} >
                        <div className="measurementPoint">
                            <div className="dataPoint">
                                <span className="title">Lat:</span> {coord.coords.x}
                            </div>
                            <div className="dataPoint">
                                <span className="title">Long:</span> {coord.coords.y}
                            </div>
                        </div>

                        <div className="distance-and-arrow">
                            {coord.distance}
                            <i className="fas fa-arrow-down"></i>
                        </div>
                    </span>
                )}
            </div>);

        return content;
    }
}

export default BathymetryMeasurementPointsPanel;

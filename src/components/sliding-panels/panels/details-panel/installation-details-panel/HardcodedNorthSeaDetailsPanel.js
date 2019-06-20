import React from 'react';
import '../../Panels.scss';
import ConfigInstallationDetailsPanel from '../ConfigInstallationDetailsPanel';

const properties = {
    "Image ID": -1, "Details": [
        {
            "name": "High Level View",
            "items": [
                { "name": "Area", "value": "North Sea" },
                { "name": "First Oil/Gas Date", "value": "1851" },
                { "name": "Platforms", "value": "432" }
            ]
        },
        {
            "name": "Weights",
            "items": [
                { "name": "Lightship", "value": "5,360,310 Tonnes" },
                { "name": "Tanks/Consumables", "value": "1,503,216 Tonnes" },
                { "name": "Topsides", "value": "2,277,370 Tonnes" },
                { "name": "Weight Displacement", "value": "2,245,958 Tonnes" }
            ]
        },
        {
            "name": "Decomissioning",
            "items": [
                { "name": "Platforms (5 years)", "value": "5" },
                { "name": "Weight", "value": "191,280.6 Tonnes" }
            ]
        },
        {
            "name": "Production",
            "items": [
                { "name": "Oil", "value": "889,246 barrels/day" },
                { "name": "Hydrocarbon", "value": "1,526,800 boe/day" },
                { "name": "Offshore Wind Rate", "value": "12 GW" },
                { "name": "Offshore Wind (last 24h)", "value": "112.157 GWh" },
                { "name": "Offshore Wind (last month)", "value": "3140.4 GWh" },
                { "name": "Offshore Wind (last year)", "value": "25.9 TWh" }

            ]
        },
        {
            "name": "Consumption",
            "items": [
                { "name": "Fuel", "value": "179,200 liters/day (diesel)" },
                { "name": "Electricity", "value": "705 MW" }
            ]
        }
    ]
}

class HardcodedNorthSeaDetailsPanel extends React.Component {

    render() {
        return (
            <ConfigInstallationDetailsPanel
                installationDetails={properties}
                installationSelectorComponent={true}
                onInstallationFilterClick={this.props.onInstallationFilterClick}>
            </ConfigInstallationDetailsPanel>
        )
    }
}

export default HardcodedNorthSeaDetailsPanel;


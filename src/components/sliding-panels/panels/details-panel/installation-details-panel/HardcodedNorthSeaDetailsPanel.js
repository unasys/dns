import React from 'react';
import '../../Panels.scss';
import ConfigInstallationDetailsPanel from '../ConfigInstallationDetailsPanel';

const properties = {
    "Image ID": -1
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


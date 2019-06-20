import React from 'react';
import '../../Panels.scss';
import ConfigInstallationDetailsPanel from '../ConfigInstallationDetailsPanel';

class InstallationDetailsPanel extends React.Component {

    render() {
        let content;
        if (this.props.installationDetails.DetailsPanel) {
            content =
                <ConfigInstallationDetailsPanel
                    installationDetails={this.props.installationDetails.DetailsPanel}
                    projectId={this.props.projectId}>
                </ConfigInstallationDetailsPanel>
        } else {
            content = <div></div>
        }

        return (
            content
        );
    }
}

export default InstallationDetailsPanel;
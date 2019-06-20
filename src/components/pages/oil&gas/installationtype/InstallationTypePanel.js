import React from 'react';
import InstallationTypeSelector from './InstallationTypeSelector';
import InstallationTypeInstallations from './InstallationTypeInstallations';
import { changeCurrentInstallation } from '../../../../actions/installationActions';
import { connect } from 'react-redux';

class InstallationTypePanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            installationTypeSelected: ''
        }

        this.onTypeSelected = this.onTypeSelected.bind(this);
        this.clearTypeSelected = this.clearTypeSelected.bind(this);

        this.props.addToBreadcrumbs({
            name: 'Type', onClick: () => {
                this.clearTypeSelected()
                this.props.changeCurrentInstallation(null)
            }
        });
    }

    onTypeSelected(type) {
        this.setState({
            installationTypeSelected: type
        })
    }

    clearTypeSelected() {
        this.setState({
            installationTypeSelected: ''
        })
    }

    render() {
        return (this.state.installationTypeSelected === '' ?
            <InstallationTypeSelector
                installations={this.props.installations}
                onTypeSelected={this.onTypeSelected}>
            </InstallationTypeSelector>
            :
            <InstallationTypeInstallations
                installationType={this.state.installationTypeSelected}
                installations={this.props.installations}
                addToBreadcrumbs={this.props.addToBreadcrumbs}
                onInstallationClick={this.props.onInstallationClick}
                setCesiumInstallations={this.props.setCesiumInstallations}>
            </InstallationTypeInstallations>)
    }
}

function mapDispatchToProps(dispatch) {
    return {
        changeCurrentInstallation: (currentInstallation) => {
            dispatch(changeCurrentInstallation(currentInstallation))
        }
    }
}

export default connect(null, mapDispatchToProps)(InstallationTypePanel)
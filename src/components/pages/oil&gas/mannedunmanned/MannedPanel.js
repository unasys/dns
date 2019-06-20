import React from 'react';
import MannedSelector from './MannedSelector';
import MannedInstallations from './MannedInstallations';
import { changeCurrentInstallation } from '../../../../actions/installationActions';
import { connect } from 'react-redux';

class MannedPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            mannedSelected: ''
        }

        this.onMannedSelected = this.onMannedSelected.bind(this);
        this.clearMannedSelected = this.clearMannedSelected.bind(this);

        this.props.addToBreadcrumbs({
            name: 'Crew', onClick: () => {
                this.clearMannedSelected()
                this.props.changeCurrentInstallation(null)
            }
        });
    }

    onMannedSelected(type) {
        this.setState({
            mannedSelected: type
        })
    }

    clearMannedSelected() {
        this.setState({
            mannedSelected: ''
        })
    }

    render() {
        return (this.state.mannedSelected === '' ?
            <MannedSelector
                installations={this.props.installations}
                onMannedSelected={this.onMannedSelected}>
            </MannedSelector>
            :
            <MannedInstallations
                mannedOrUnmanned={this.state.mannedSelected}
                installations={this.props.installations}
                addToBreadcrumbs={this.props.addToBreadcrumbs}
                onInstallationClick={this.props.onInstallationClick}
                setCesiumInstallations={this.props.setCesiumInstallations}>
            </MannedInstallations>)
    }
}

function mapDispatchToProps(dispatch) {
    return {
        changeCurrentInstallation: (currentInstallation) => {
            dispatch(changeCurrentInstallation(currentInstallation))
        }
    }
}

export default connect(null, mapDispatchToProps)(MannedPanel)
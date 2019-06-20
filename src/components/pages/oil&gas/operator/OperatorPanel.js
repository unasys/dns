import React from 'react';
import OperatorSelector from './OperatorSelector';
import OperatorInstallations from './OperatorInstallations';
import { changeCurrentInstallation } from '../../../../actions/installationActions';
import { connect } from 'react-redux';

class OperatorPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            operatorSelected: ''
        }

        this.onOperatorSelected = this.onOperatorSelected.bind(this);
        this.clearOperatorSelected = this.clearOperatorSelected.bind(this);
        this.props.addToBreadcrumbs({
            name: 'Operator', onClick: () => {
                this.props.changeCurrentInstallation(null)
                this.clearOperatorSelected()
            }
        });
    }

    onOperatorSelected(operator) {
        this.setState({
            operatorSelected: operator
        })
    }

    clearOperatorSelected() {
        this.setState({
            operatorSelected: ''
        })
    }

    render() {
        return (this.state.operatorSelected === '' ?
            <OperatorSelector
                installations={this.props.installations}
                onOperatorSelected={this.onOperatorSelected}>
            </OperatorSelector>
            :
            <OperatorInstallations
                operator={this.state.operatorSelected}
                installations={this.props.installations}
                addToBreadcrumbs={this.props.addToBreadcrumbs}
                onInstallationClick={this.props.onInstallationClick}
                setCesiumInstallations={this.props.setCesiumInstallations}>
            </OperatorInstallations>)
    }
}

function mapDispatchToProps(dispatch) {
    return {
        changeCurrentInstallation: (currentInstallation) => {
            dispatch(changeCurrentInstallation(currentInstallation))
        }
    }
}

export default connect(null, mapDispatchToProps)(OperatorPanel)

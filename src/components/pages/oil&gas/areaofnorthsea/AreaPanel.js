import React from 'react';
import AreaSelector from './AreaSelector';
import AreaInstallations from './AreaInstallations';
import { changeCurrentInstallation } from '../../../../actions/installationActions';
import { connect } from 'react-redux';

class AreaPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            areaSelected: ''
        }

        this.onAreaSelected = this.onAreaSelected.bind(this);
        this.clearAreaSelected = this.clearAreaSelected.bind(this);

        this.props.addToBreadcrumbs({
            name: 'Area', onClick: () => {
                this.clearAreaSelected();
                this.props.changeCurrentInstallation(null)
            }
        });
    }

    onAreaSelected(type) {
        this.setState({
            areaSelected: type
        })
    }

    clearAreaSelected() {
        this.setState({
            areaSelected: ''
        })
    }

    render() {
        return (this.state.areaSelected === '' ?
            <AreaSelector
                installations={this.props.installations}
                onAreaSelected={this.onAreaSelected}>
            </AreaSelector>
            :
            <AreaInstallations
                installationArea={this.state.areaSelected}
                installations={this.props.installations}
                addToBreadcrumbs={this.props.addToBreadcrumbs}
                onInstallationClick={this.props.onInstallationClick}
                setCesiumInstallations={this.props.setCesiumInstallations}>
            </AreaInstallations>)
    }
}

function mapDispatchToProps(dispatch) {
    return {
        changeCurrentInstallation: (currentInstallation) => {
            dispatch(changeCurrentInstallation(currentInstallation))
        }
    }
}

export default connect(null, mapDispatchToProps)(AreaPanel)
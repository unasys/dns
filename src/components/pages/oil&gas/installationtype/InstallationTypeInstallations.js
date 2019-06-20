import React from 'react';
import ResultItem from '../../../result-item/ResultItem';
import { INSTALLATION_FILTER_TYPES, changeInstallationFilterType } from '../../../../actions/installationActions';
import { connect } from 'react-redux';

class InstallationTypeInstallations extends React.Component {
    constructor(props) {
        super(props);
        this.props.addToBreadcrumbs({name: this.props.installationType, onClick:() => {}});
        this.state = {
            installationsByType: []
        }
    }

    
    componentDidMount() {
        this.props.changeInstallationFilterType(INSTALLATION_FILTER_TYPES.Property, "Facility Type Description", this.props.installationType);
        let installationsByType = this.props.installations.filter(installation => installation["Facility Type Description"] === this.props.installationType);
        this.setState({
            installationsByType: installationsByType
        })
    }
   
   
    render() {
        return (
            this.state.installationsByType.map(installation => {
                return (
                    <ResultItem 
                        key={installation["Facility Name"]}
                        content={installation["Facility Name"]}
                        contentOnClick={() => this.props.onInstallationClick(installation)}>
                    </ResultItem>);
            })
        );
    }
}

function mapDispatchToProps(dispatch) {
    return { 
        changeInstallationFilterType: (filterType, propertyName, filterOn) => {
            dispatch(changeInstallationFilterType(filterType, propertyName, filterOn))
        }
    }
}
export default connect(null, mapDispatchToProps)(InstallationTypeInstallations)
  
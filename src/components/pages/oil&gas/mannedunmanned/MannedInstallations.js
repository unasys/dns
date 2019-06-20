import React from 'react';
import ResultItem from '../../../result-item/ResultItem';
import { changeInstallationFilterType, INSTALLATION_FILTER_TYPES } from '../../../../actions/installationActions';
import { connect } from 'react-redux';

class MannedInstallations extends React.Component {
    constructor(props) {
        super(props);
        this.props.addToBreadcrumbs({name: this.props.mannedOrUnmanned, onClick:() => {}});
        this.state = {
            installationsByMannedState: []
        }
    }

    componentDidMount() {
        this.props.changeInstallationFilterType(INSTALLATION_FILTER_TYPES.Property, "Manned or Unmanned", this.props.mannedOrUnmanned);
    }
   
    render() {
        return (
            this.state.installationsByMannedState.map(installation => {
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
export default connect(null, mapDispatchToProps)(MannedInstallations)

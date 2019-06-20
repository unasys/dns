import React from 'react';
import ResultItem from '../../../result-item/ResultItem';
import { connect } from 'react-redux';
import { changeInstallationFilterType, INSTALLATION_FILTER_TYPES } from '../../../../actions/installationActions';

class AreaInstallations extends React.Component {
    constructor(props) {
        super(props);
        this.props.addToBreadcrumbs({name: this.props.installationArea, onClick:() => {}});
        this.state = {
            installationsByArea: []
        }
    }

    componentDidMount() {
        this.props.changeInstallationFilterType(INSTALLATION_FILTER_TYPES.Property, "Area", this.props.installationArea);
        let installationsByArea = this.props.installations.filter(installation => installation["Area"] === this.props.installationArea);
        this.setState({
            installationsByArea: installationsByArea
        })
    }

    render() {
        return (
            this.state.installationsByArea.map(installation => {
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
export default connect(null, mapDispatchToProps)(AreaInstallations)
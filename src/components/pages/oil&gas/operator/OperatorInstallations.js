import React from 'react';
import ResultItem from '../../../result-item/ResultItem';
import { connect } from 'react-redux';
import { changeInstallationFilterType, INSTALLATION_FILTER_TYPES } from '../../../../actions/installationActions';

class OperatorInstallations extends React.Component {
    constructor(props) {
        super(props);
        this.props.addToBreadcrumbs({ name: this.props.operator, onClick: () => { } });
        this.state = {
            installationsByOperator: []
        }
    }

    componentDidMount() {
        let filteredInstallations = this.props.installations.filter(installation => installation["Facility Operator"] === this.props.operator);
        this.props.changeInstallationFilterType(INSTALLATION_FILTER_TYPES.Property, "Facility Operator", this.props.operator);
        this.setState({
            installationsByOperator: filteredInstallations
        });
    }

    render() {
        return (
            this.state.installationsByOperator.map(installation => {
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
export default connect(null, mapDispatchToProps)(OperatorInstallations)
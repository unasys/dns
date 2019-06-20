import React from 'react';
import ResultItem from '../../../result-item/ResultItem';

class InstallationTypeSelector extends React.Component {
    render() {
        const distinctOperators = [...new Set(this.props.installations.map(installation => installation["Facility Type Description"]))];
        return (
            distinctOperators.map(operator => {
                return <ResultItem key={operator} content={operator} contentOnClick={this.props.onTypeSelected.bind(this, operator)}></ResultItem>;
            })
        );
    }
}

export default InstallationTypeSelector;

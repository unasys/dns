import React from 'react';
import ResultItem from '../../../result-item/ResultItem';

class OperatorSelector extends React.Component {
    render() {
        const distinctOperators = [...new Set(this.props.installations.map(installation => installation["Facility Operator"]))];
        const sortedOperators = distinctOperators.sort()
        return (
            sortedOperators.map(operator => {
                return <ResultItem key={operator} content={operator} contentOnClick={this.props.onOperatorSelected.bind(this, operator)}></ResultItem>;
            })
        );
    }
}

export default OperatorSelector;
